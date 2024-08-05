import * as vscode from 'vscode';
import { getHtmlFilesInSameFolder } from '../checkTestCase';

export const getHint = (context: vscode.ExtensionContext) => {
    const apiKey = vscode.workspace.getConfiguration('BOJ-EX').get<string>('GPT-API');

    if (!apiKey) {
        vscode.window.showErrorMessage('설정에서 OpenAI API키를 입력해주세요.');
        return;
    }

    // api키가 있다면 일단 문제 번호를 가져와야한다.
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('해당 문제 코드 창을 띄운 후 실행해 주세요.');
        return;
    }

    // 파일명으로 번호 가져오기

    const document = editor.document;
    const filePath = editor.document.fileName;
    const htmlFiles = getHtmlFilesInSameFolder(document);
    if (htmlFiles.length === 0) {
        vscode.window.showErrorMessage('해당 문제의 HTML 파일을 찾을 수 없습니다.');
        return;
    }
    const number = htmlFiles[0].split('.')[0];

    console.log(number);

    getHintAPI(apiKey, number);
};

// ========================================================================================================

import OpenAI from 'openai';

let lastHintRequest: number = 0;
const HINT_REQUEST_INTERVAL = 300000; // 5 minutes

/**
 * @title GPT 한테 힌트 물어보기
 * @Description GPT-4o-mini 모델을 사용하여 문제 번호를 통해 힌트를 받아오는 함수이다.
 * @쿨타임 5분
 * @토큰 150토큰
 * @param apiKey api키
 * @param number 문제 번호
 */
const getHintAPI = async (apiKey: string, number: string) => {
    const now = Date.now();
    if (now - lastHintRequest < HINT_REQUEST_INTERVAL) {
        vscode.window.showInformationMessage('힌트 요청은 5분마다 가능합니다.');
        return;
    }

    lastHintRequest = now;
    const client = new OpenAI({
        apiKey: apiKey, // This is the default and can be omitted
    });
    const resultConsole = vscode.window.createOutputChannel('Hint');
    resultConsole.show(true);
    const url = `https://www.acmicpc.net/problem/${number}`;

    const question = `${url}에 있는 문제를 풀고 있는데 정답말고 힌트만 줄수 있어? 150토큰 이내로 부탁해.`;
    resultConsole.clear();

    resultConsole.appendLine('-'.repeat(50));

    resultConsole.appendLine(`# 문제 주소: ${url}`);
    resultConsole.appendLine('-'.repeat(50));
    resultConsole.appendLine(centerText('💡 힌트', 48));
    resultConsole.appendLine('-'.repeat(50));

    try {
        const response = await client.chat.completions.create({
            messages: [{ role: 'user', content: question }],
            model: 'gpt-4o-mini',
            max_tokens: 150,
            stream: true,
        });

        let hintBuffer = '';

        for await (const chunk of response) {
            if (chunk.choices[0].delta && chunk.choices[0].delta.content) {
                hintBuffer += chunk.choices[0].delta.content; // Accumulate data chunks
                resultConsole.append(hintBuffer); // Append accumulated data
                hintBuffer = ''; // Clear buffer after appending
            }
        }
        resultConsole.append('\n');

        resultConsole.appendLine('-'.repeat(50));
        resultConsole.appendLine('🚀 The hint is powered by GPT / 이 힌트는 GPT에 의해 제공되었습니다 🚀');
        resultConsole.appendLine('-'.repeat(50));
    } catch (error: any) {
        if (error.status === 401) {
            resultConsole.appendLine('OpenAI API키가 잘못되었습니다.');
        } else {
            resultConsole.appendLine('-'.repeat(50));
            resultConsole.appendLine('힌트 요청 중 오류 발생:');
            resultConsole.appendLine('-'.repeat(50));
            resultConsole.appendLine(error.message || '알 수 없는 오류 발생');
            resultConsole.appendLine('-'.repeat(50));
        }
    }
};

function centerText(text: string, maxWidth: number) {
    const padding = Math.max(0, maxWidth - text.length);
    const paddingLeft = Math.floor(padding / 2);
    const paddingRight = padding - paddingLeft;
    return ' '.repeat(paddingLeft - 1) + ' ' + text + ' ' + ' '.repeat(paddingRight - 1);
}
