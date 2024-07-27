import * as vscode from 'vscode';
import { problemData } from '../types/problemData';
import { getProblemData } from '../utils/getProblemData';

import { ProblemNumberInputValidation } from '../types/validation';
import { makeFolder } from '../utils/makeFolder';

// =================================================================================================
// After Repactoring
/**
 * @Title 문제 번호 입력 함수
 * @param context vscode.ExtensionContext
 */
export const InputProblemNumber = (context: vscode.ExtensionContext) => {
    // 실행될 함수
    vscode.window.showInformationMessage('테스트 성공');
    // 문제 번호를 받을 입력창 만들기
    vscode.window
        .showInputBox({
            title: '문제 번호를 입력해 주세요.',
            prompt: '숫자만 입력해주시면 됩니다.',
            placeHolder: 'ex) 1001',
        })
        .then((problemNumber) => {
            // 먼저 입력받은 값의 검증해야한다.
            if (ProblemNumberInputValidation(problemNumber)) {
                InputLanguage(context, problemNumber);
            } else {
                vscode.window.showErrorMessage('올바른 번호를 입력해주세요.');
                InputProblemNumber(context);
            }
        });
};
// =================================================================================================

/**
 * @Title 언어 확장자 입력 함수
 * @param context vscode.ExtensionContext
 */
// 만약 문제가 존재한다면 이제 사용할 언어의 확장자를 입력받아야한다.
const InputLanguage = (context: vscode.ExtensionContext, number: string | undefined) => {
    vscode.window
        .showInputBox({
            title: '사용할 언어의 확장자를 입력해주세요.',
            prompt: '사용 가능 언어 : c, cpp, py, js, java',
            placeHolder: 'ex) py',
        })
        .then((languageInput) => {
            languageInput = languageInput?.trim();
            if (
                languageInput === 'c' ||
                languageInput === 'cpp' ||
                languageInput === 'js' ||
                languageInput === 'py' ||
                languageInput === 'java'
            ) {
                // 이제 문제 파일 생성 함수 제작
                getProblem(number, languageInput, context);
            }
            // 사용 가능한 확장자가 아닐경우
            else {
                vscode.window.showErrorMessage('사용 불가능한 확장자입니다.');
                InputLanguage(context, number);
            }
        });
};
// =================================================================================================

/**
 *
 * @param number 문제 번호
 * @param language 확장자 명
 * @param context vscode.ExtensionContext
 */

const getProblem = async (number: string | undefined, language: string, context: vscode.ExtensionContext) => {
    if (number === undefined) {
        return;
    }

    const problemData: problemData | void = await getProblemData(number);
    //   console.log(problemData);

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
        makeFolder(folder, number, language, problemData, context);
    }

    // 해당문제 데이터 가져오기
};

// Before Repactoring

// =================================================================================================

// 입문한 문제 번호와 사용자가 선택한 언어의 확장자를 받아서 파일을 생성해주는 함수를 만들어야한다.
/**
const getProblem = async (
  number: string | undefined,
  language: string,
  context: vscode.ExtensionContext
) => {
  if (number === undefined) {
    return;
  }
  const url = `https://www.acmicpc.net/problem/${number}`;

  const problemData: problemData | void = await getProblemData(number);
  //   console.log(problemData);

   // 유저가 원하는 폴더위치에 문제 폴더를 생성한다.
   
  let options = {
    canSelectMany: false,
    openLabel: "Select",
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
      vscode.window.showErrorMessage("해당 문제 폴더가 이미 존재합니다.");
    } catch (err) {
      // 폴더 생성
      // 폴더가 존재하지 않으면 생성
      try {
        await fs.promises.mkdir(newFolderPath, { recursive: true });
        vscode.window.showInformationMessage("문제 폴더가 생성되었습니다.");

        // 문제 파일 생성
        const Readme = "README.md";
        const problem = `${number}.html`;
        const fileName = `Main.${language}`;
        const filePath = path.join(newFolderPath, fileName);
        const ReadmePath = path.join(newFolderPath, Readme);
        const problemPath = path.join(newFolderPath, problem);

        const fileContent = juseokForm(language, problemData!, number);
        const ReadmeContent = `# ${number}번: ${
          problemData!.title
        }\n\n## 문제\n${problemData!.description}\n\n## 입력\n${
          problemData!.input
        }\n\n## 출력\n${problemData!.output}\n\n## 예제\n`;
        const problemContent = ProblemHtmlForm(problemData!);

        await fs.promises.writeFile(filePath, fileContent);
        vscode.window.showInformationMessage(
          "파일이 생성되었습니다: " + filePath
        );

        await fs.promises.writeFile(ReadmePath, ReadmeContent);
        vscode.window.showInformationMessage(
          "Readme 파일이 생성되었습니다: " + ReadmePath
        );

        await fs.promises.writeFile(problemPath, problemContent);
        vscode.window.showInformationMessage(
          "문제 HTML 파일이 생성되었습니다: " + problemPath
        );

        if (language === "js") {
          await initializeNodeProject(newFolderPath);
        }

        // 왼쪽 분할 화면에 텍스트 에디터를 열기
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document, {
          viewColumn: vscode.ViewColumn.One,
        });

        // =================================================================
        // 이제 문제를 시각화 해주면 된다.

        showProblem(number, problemData, context);
      } catch (err) {
        vscode.window.showErrorMessage(
          "파일 생성에 실패했습니다. 다시 시도해주세요."
        );
      }

      // 폴더 생성 완료
      // =================================================================
    }
  }

  // 해당문제 데이터 가져오기
};
*/
