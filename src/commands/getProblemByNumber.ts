import * as vscode from 'vscode';
import path from 'node:path';
import * as fs from 'fs';
import { problemData } from '../types/problemData';
import { showProblem } from './ShowProblemDocument';
import { juseokForm, ProblemHtmlForm } from '../utils/makeForm';
import { getProblemData } from '../utils/getProblemData';

// 입문한 문제 번호와 사용자가 선택한 언어의 확장자를 받아서 파일을 생성해주는 함수를 만들어야한다.
export const getProblem = async (number: string | undefined, language: string, context: vscode.ExtensionContext) => {
    if (number === undefined) {
        return;
    }
    const url = `https://www.acmicpc.net/problem/${number}`;

    const problemData: problemData | void = await getProblemData(number);
    console.log(problemData);

    /**
     * 유저가 원하는 폴더위치에 문제 폴더를 생성한다.
     */
    let options = {
        canSelectMany: false,
        openLabel: 'Select',
        canSelectFolders: true,
        canSelectFiles: false,
    };
    const folder = await vscode.window.showOpenDialog(options);

    if (folder && folder[0]) {
        let selectedFolderPath = folder[0].fsPath;

        const folderName = `${number}번: ${problemData!.title}`;

        let newFolderPath = path.join(selectedFolderPath, folderName);

        try {
            await fs.promises.access(newFolderPath, fs.constants.F_OK);
            vscode.window.showErrorMessage('해당 문제 폴더가 이미 존재합니다.');
        } catch (err) {
            // 폴더 생성
            // 폴더가 존재하지 않으면 생성
            try {
                await fs.promises.mkdir(newFolderPath, { recursive: true });
                vscode.window.showInformationMessage('문제 폴더가 생성되었습니다.');

                // 문제 파일 생성
                const Readme = 'README.md';
                const problem = 'Problem.html';
                const fileName = `Main.${language}`;
                const filePath = path.join(newFolderPath, fileName);
                const ReadmePath = path.join(newFolderPath, Readme);
                const problemPath = path.join(newFolderPath, problem);

                const fileContent = juseokForm(language, problemData!, number);
                const ReadmeContent = `# ${number}번: ${problemData!.title}\n\n## 문제\n${
                    problemData!.description
                }\n\n## 입력\n${problemData!.input}\n\n## 출력\n${problemData!.output}\n\n## 예제\n`;
                const problemContent = ProblemHtmlForm(problemData!);

                await fs.promises.writeFile(filePath, fileContent);
                vscode.window.showInformationMessage('파일이 생성되었습니다: ' + filePath);

                await fs.promises.writeFile(ReadmePath, ReadmeContent);
                vscode.window.showInformationMessage('Readme 파일이 생성되었습니다: ' + ReadmePath);

                await fs.promises.writeFile(problemPath, problemContent);
                vscode.window.showInformationMessage('문제 HTML 파일이 생성되었습니다: ' + problemPath);

                // 왼쪽 분할 화면에 텍스트 에디터를 열기
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document, {
                    viewColumn: vscode.ViewColumn.One,
                });

                // =================================================================
                // 이제 문제를 시각화 해주면 된다.

                showProblem(number, problemData, context);
            } catch (err) {
                vscode.window.showErrorMessage('파일 생성에 실패했습니다. 다시 시도해주세요.');
            }

            // 폴더 생성 완료
            // =================================================================
        }
    }

    // 해당문제 데이터 가져오기
};
