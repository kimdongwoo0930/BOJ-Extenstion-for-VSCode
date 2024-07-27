import { problemData } from '../types/problemData';
import * as vscode from 'vscode';
import * as cheerio from 'cheerio';

export const getProblemData = async (number: string | undefined): Promise<problemData | any> => {
    const url = `https://www.acmicpc.net/problem/${number}`;

    let problemData: problemData | null = null;

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Window,
            title: '로딩 중...',
            cancellable: false, // 사용자가 취소할 수 없도록 설정
        },
        async (progress) => {
            const $ = await fetchHtmlData(url);

            if ($) {
                // 문제 제목
                const title: string = $('#problem_title').text();
                // 문제 정보
                const info = $('#problem-info').html();
                // 문제 본문
                const description = $('#problem_description').html()!.replace(/\t/g, '');

                // 입력, 출력, 예제 입력, 예제 출력 추출
                const input = $('#problem_input').html()!.replace(/\t/g, '');
                const output = $('#problem_output').html()!.replace(/\t/g, '');

                // 제한 추출
                const limit = $('#problem_limit').html();

                // 예제 입력, 예제 출력, 예제 설명 추출 (배열로 처리)
                const testCaseInputs: string[] = [];
                const testCaseOutputs: string[] = [];
                const testCaseExplains: string[] = [];

                let index = 1;
                while (true) {
                    const testCaseInput = $(`#sample-input-${index}`).html();
                    const testCaseOutput = $(`#sample-output-${index}`).html();
                    const testCaseExplain = $(`#sample_explain_${index}`).html();

                    if (!testCaseInput || !testCaseOutput) {
                        break;
                    }

                    testCaseInputs.push(testCaseInput);
                    testCaseOutputs.push(testCaseOutput);
                    if (testCaseExplain) {
                        testCaseExplains.push(testCaseExplain);
                    }
                    index++;
                }

                // 힌트 추출
                const hint = $('#problem_hint').html();

                // 출처 추출
                const source = $('#source').html();

                problemData = {
                    title,
                    info,
                    description,
                    input,
                    output,
                    limit,
                    testCaseInputs,
                    testCaseOutputs,
                    testCaseExplains,
                    hint,
                    source,
                };
            }
        }
    );

    return problemData;
};

export const fetchHtmlData = async (url: string) => {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text(); // HTML을 텍스트로 변환

        // HTML 문자열을 DOM으로 파싱
        const $ = cheerio.load(html);

        // HTML을 반환해준다.
        return $;
    } catch (error) {
        vscode.window.showErrorMessage('존재하지 않는 문제입니다.');
    }
};
