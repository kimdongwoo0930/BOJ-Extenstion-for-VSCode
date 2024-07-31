import path from 'path';
import * as vscode from 'vscode';
import { spawn, execSync } from 'child_process';
import { getProblemData } from '../utils/getProblemData';
import { problemData } from '../types/problemData';
import * as fs from 'fs';
import * as os from 'os';
/**
 * **checkTestCase** 함수는 현재 열린 코드 파일에 대해
 * 주어진 문제의 테스트 케이스를 실행하고 결과를 VSCode의
 * 출력 채널에 표시합니다.
 *
 * @param context - VSCode 확장 프로그램의 컨텍스트
 */
export const checkTestCase = async (context: vscode.ExtensionContext) => {
    try {
        const editor = vscode.window.activeTextEditor;
        const maxWidth = 50;
        const resultConsole = vscode.window.createOutputChannel('Test Cases');
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        const filePath = editor.document.fileName;
        const lang = path.extname(document?.fileName).replace('.', '').trim();
        const htmlFiles = getHtmlFilesInSameFolder(document);
        if (htmlFiles.length === 0) {
            vscode.window.showErrorMessage('HTML 파일을 찾을 수 없습니다.');
            return;
        }
        const number = htmlFiles[0].split('.')[0];
        // console.log();
        // console.log(`확장자 : ${lang}`);
        // console.log(`문제 번호 : ${number}`);

        if (lang === 'py' || lang === 'c' || lang === 'cpp' || lang === 'js' || lang === 'java') {
            // console.log("available languages");

            // 문제 가져오기
            // const url = `https://www.acmicpc.net/problem/${number}`;
            const problemData: problemData | null = await getProblemData(number);
            if (problemData === null) {
                vscode.window.showErrorMessage('문제를 가져오는데 실패했습니다.');
                return;
            }

            // 메세지 띄우기
            const message_1 = centerText(`${number}번: ${problemData!.title}`, maxWidth);
            resultConsole.appendLine(message_1);

            let command: string;
            for (let i = 0; i < problemData.testCaseInputs!.length; i++) {
                await runCommand(
                    lang,
                    filePath,
                    problemData!.testCaseInputs![i],
                    problemData!.testCaseOutputs![i],
                    resultConsole,
                    i
                );
            }
            resultConsole.show(true);

            // 이제 작성한 코드 테스트를 하는 함수를 작성하면 된다.
        } else {
            vscode.window.showErrorMessage('테스트할 파일을 열고 실행해 주세요.');
        }
    } catch (error) {
        // console.log(error);
        vscode.window.showErrorMessage('오류 발생 다시 실행해주세요.');
    }
};

// =================================================================
/**
 * **runCommand** 함수는 주어진 언어와 파일 경로를 사용하여
 * 테스트 케이스를 실행하고 결과를 출력 채널에 표시합니다.
 *
 * @param lang - 코드 파일의 프로그래밍 언어
 * @param filePath - 코드 파일의 경로
 * @param input - 테스트 케이스 입력
 * @param resultOutput - 예상 출력
 * @param resultConsole - 결과를 표시할 VSCode 출력 채널
 * @param index - 테스트 케이스 번호
 */
const runCommand = async (
    lang: string,
    filePath: string,
    input: string,
    resultOutput: string,
    resultConsole: vscode.OutputChannel,
    index: number
) => {
    return new Promise<void>((resolve, rejects) => {
        let outputs = '';
        if (lang === 'js') {
            writeInputTXT(input, filePath, lang);
        }
        const process = processSetting(lang, filePath);

        if (!process) {
            rejects(new Error('Failed to start process'));
            return;
        }

        const startTime = performance.now();

        process.stdout.on('data', (data: Buffer) => {
            outputs += data.toString();
        });

        process.stderr.setEncoding('utf-8');

        // 테스트 오류 시
        process.stderr.on('data', (data: Buffer | string) => {
            // Buffer가 아닌 경우에는 그대로 사용
            const errorOutput = typeof data === 'string' ? data.trim() : data.toString('utf-8').trim();

            resultConsole.appendLine('-'.repeat(50));
            resultConsole.appendLine(`Test Case ${index + 1}: 오류 ⚠️`);
            resultConsole.appendLine('-'.repeat(50));
            resultConsole.appendLine(`오류 출력: ${errorOutput}`);
            resultConsole.appendLine('-'.repeat(50));
        });

        process.on('close', (code: number) => {
            const endTime = performance.now();
            const processingTime = ((endTime - startTime) / 1000).toFixed(2);
            const output = outputs.trim();
            if (code === 0) {
                resultConsole.appendLine('-'.repeat(50));
                resultConsole.appendLine(
                    `Test Case ${index + 1}: ${
                        output.replace(/\r?\n|\r/g, ' ') === resultOutput.trim().replace(/\n/g, ' ')
                            ? '성공 ✅'
                            : '실패 ❌'
                    }`
                );
                resultConsole.appendLine('-'.repeat(50));
                resultConsole.appendLine(`입력: ${input.trim().replace(/\n/g, ' ')}`);
                resultConsole.appendLine(`예상 출력: ${resultOutput.trim().replace(/\n/g, ' ')}`);
                resultConsole.appendLine(`실제 출력: ${output.replace(/\r?\n|\r/g, ' ')}`);
                resultConsole.appendLine('-'.repeat(50));
                resultConsole.appendLine(`걸린 시간: ${processingTime}ms`);
                resultConsole.appendLine('-'.repeat(50));
            }
            resolve();
        });

        // 비동기 작업을 동기처럼 처리
        process.stdin.write(input, 'utf-8', (err) => {
            if (err) {
                rejects(err);
                return;
            }
            process.stdin.end(); // 입력 종료
        });
    });
};

/**
 * **processSetting** 함수는 주어진 언어와 파일 경로에 따라
 * 적절한 프로세스를 생성하고 반환합니다.
 *
 * @param lang - 코드 파일의 프로그래밍 언어
 * @param filePath - 코드 파일의 경로
 * @returns - 생성된 프로세스 객체
 */
const processSetting = (lang: string, filePath: string) => {
    // Linux : 리눅스 / Darwin : 맥 / Windows_NT : 윈도우
    const platform = os.type();
    if (lang === 'py') {
        if (platform === 'Windows_NT') {
            return spawn('python', [filePath]);
        } else {
            return spawn('python3', [filePath]);
        }
    } else if (lang === 'c') {
        const file = filePath.replace(/\.[^/.]+$/, '');
        try {
            execSync(`gcc "${filePath}" -o "${file}" -std=gnu11`);
            // execSync(`chmod +x ${filePath}/${file}"`);
            if (platform === 'Windows_NT' || platform === 'Linux') {
                return spawn('./main', { cwd: path.dirname(filePath) });
            }
            return spawn(`./${file}`);
        } catch (error) {
            new Error(`컴파일 오류: ${error}`);
        }
    } else if (lang === 'cpp') {
        const file = filePath.slice(0, filePath.length - 4);
        try {
            execSync(`g++ -std=c++17 "${filePath}" -o "${file}"`);
            if (platform === 'Windows_NT' || platform === 'Linux') {
                return spawn('./main', { cwd: path.dirname(filePath) });
            }
            return spawn(`./${file}`);
        } catch (error) {
            new Error(`컴파일 오류: ${error}`);
        }
    } else if (lang === 'java') {
        const dirName = path.dirname(filePath);
        try {
            return spawn(`java`, ['-cp', dirName, filePath]);
        } catch (error) {
            new Error(`컴파일 오류: ${error}`);
        }
    } else if (lang === 'js') {
        return spawn('node', [filePath]);
    } else {
        new Error(`Unsupported language: ${lang}`);
    }
};

const resultMessage = (index: number, resultConsole: vscode.OutputChannel) => {
    // 테스트 케이스 결과 메세지
    /**
     * success
     */
    /**
     * fail
     */
};

function centerText(text: string, maxWidth: number) {
    const padding = Math.max(0, maxWidth - text.length);
    const paddingLeft = Math.floor(padding / 2);
    const paddingRight = padding - paddingLeft;
    return '='.repeat(paddingLeft - 1) + ' ' + text + ' ' + '='.repeat(paddingRight - 1);
}

/**
 * **getHtmlFileNames** 함수는 지정된 폴더 내의 HTML 파일 이름을 가져옵니다.
 *
 * @param folderPath - 폴더 경로
 * @returns - HTML 파일 이름의 배열
 */
const getHtmlFileNames = (folderPath: string): string[] => {
    try {
        const files = fs.readdirSync(folderPath);
        // HTML 파일만 필터링
        return files.filter((file) => path.extname(file) === '.html');
    } catch (error) {
        // console.error(`폴더를 읽는 중 오류 발생: ${error}`);
        return [];
    }
};

// 현재 파일의 폴더 내 HTML 파일 이름을 가져오는 함수
const getHtmlFilesInSameFolder = (document: vscode.TextDocument): string[] => {
    const folderPath = getFolderPath(document.fileName);
    return getHtmlFileNames(folderPath);
};

// 현재 파일의 경로에서 폴더 경로를 가져오는 함수
const getFolderPath = (filePath: string): string => {
    return path.dirname(filePath);
};

// =================================================================================================
/**
 * **writeInputTXT** 함수는 JavaScript 코드 테스트를 위해
 * 입력 값을 `input.txt` 파일에 작성합니다.
 *
 * @param input - 테스트 케이스 입력
 * @param filePath - 코드 파일의 경로
 * @param lang - 코드 파일의 프로그래밍 언어
 */
const writeInputTXT = async (input: string, filePath: string, lang: string) => {
    const folderPath = getFolderPath(filePath);
    const inputFilePath = path.join(folderPath, 'input.txt');
    // console.log("Writing to:", inputFilePath);
    // console.log("Input content:", input);

    try {
        fs.writeFileSync(inputFilePath, input);
        // console.log("Input data written to input.txt successfully.");
    } catch (err) {
        await vscode.window.showErrorMessage('input.txt 쓰기에 실패했습니다.');
        // console.log(err);
        // console.error("Error writing to input.txt:", err);
    }
};

// const getFolderPath = () => {
//   if (lang === "js") {
//     return filePath.replace(/index\.js$/, "");
//   } else if (lang === "c") {
//     return filePath.replace(/main\.c$/, "");
//   } else if (lang === "cpp") {
//     return filePath.replace(/main\.cpp$/, "");
//   }
// };
