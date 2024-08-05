import * as vscode from 'vscode';
import { getHtmlFilesInSameFolder } from '../checkTestCase';
import * as path from 'path';
import OpenAI from 'openai';

export const getSolution = (context: vscode.ExtensionContext) => {
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
    const document = editor.document;
    const filePath = editor.document.fileName;
    const lang = path.extname(document?.fileName).replace('.', '').trim();

    if (lang !== 'py' && lang !== 'c' && lang !== 'cpp' && lang !== 'js' && lang !== 'java') {
        vscode.window.showErrorMessage('작성중인 코드 파일을 열고 실행해 주세요.');
        return;
    }

    // 파일명으로 번호 가져오기

    const htmlFiles = getHtmlFilesInSameFolder(document);
    if (htmlFiles.length === 0) {
        vscode.window.showErrorMessage('해당 문제의 HTML 파일을 찾을 수 없습니다.');
        return;
    }
    const number = htmlFiles[0].split('.')[0];

    const langName = getLangName(lang);

    console.log(number);

    getSolutionAPI(apiKey, number, langName);
};

const getSolutionAPI = async (apiKey: string, number: string, lang: string) => {
    const client = new OpenAI({
        apiKey: apiKey, // This is the default and can be omitted
    });

    const resultConsole = vscode.window.createOutputChannel('Solution');
    resultConsole.show(true);
    const url = `https://www.acmicpc.net/problem/${number}`;

    const question = `
        문제 URL: ${url}에 있는 문제를 ${lang} 언어로 해결해 주세요. 
        문제의 조건, 입력 형식, 출력 형식 등을 고려하여 해결 방법과 코드를 제공해 주시고, 각 단계에 대한 설명도 포함해 주세요. 

        특히, 다음 사항을 포함해 주세요:
        1. 문제를 해결하기 위한 알고리즘 설명
        2. 코드를 작성하는 방법 및 논리
        3. 코드의 각 부분에 대한 설명
        4. 예제 입력과 출력에 대한 테스트

        답변은 1000토큰 이내로 부탁드립니다.
`;

    resultConsole.clear();

    resultConsole.appendLine('-'.repeat(50));
    resultConsole.appendLine(centerText('🧩 해설', 48));
    resultConsole.appendLine('-'.repeat(50));

    try {
        const response = await client.chat.completions.create({
            messages: [{ role: 'user', content: question }],
            model: 'gpt-4o-mini',
            max_tokens: 1000,
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
        resultConsole.appendLine('🚀 The solution is powered by GPT / 이 해설은 GPT에 의해 제공되었습니다 🚀');
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

const getLangName = (lang: string) => {
    switch (lang) {
        case 'py':
            return 'Python';
        case 'c':
            return 'C';
        case 'cpp':
            return 'C++';
        case 'js':
            return 'JavaScript';
        case 'java':
            return 'Java';
        default:
            return 'Unknown';
    }
};

function centerText(text: string, maxWidth: number) {
    const padding = Math.max(0, maxWidth - text.length);
    const paddingLeft = Math.floor(padding / 2);
    const paddingRight = padding - paddingLeft;
    return ' '.repeat(paddingLeft - 1) + ' ' + text + ' ' + ' '.repeat(paddingRight - 1);
}
