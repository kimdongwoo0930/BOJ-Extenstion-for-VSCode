import { problemData } from "./../types/problemData";
import * as vscode from "vscode";
import path from "path";
import * as fs from "fs";
import { juseokForm, ProblemHtmlForm } from "./makeForm";
import { showProblem } from "../commands/showProblemDocument";
import { exec } from "child_process";
import { getFileName } from "../types/fileNameType";

import * as os from "os";

/**
 * @Title 폴더 생성 함수
 * @param folder
 * @param number
 * @param language
 * @param problemData
 * @param context
 */
export const makeFolder = async (
  folder: vscode.Uri[],
  number: string | undefined,
  language: string,
  problemData: problemData | void,
  context: vscode.ExtensionContext
) => {
  let selectedFolderPath = folder[0].fsPath;
  const platform = os.type();
  console.log(platform)

  const folderName = platform !== "Windows_NT" ? `${number}번: ${problemData!.title}` : `${number}번 ${problemData!.title}`;

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
      const fileName = getFileName(language);
      const filePath = path.join(newFolderPath, fileName);
      const ReadmePath = path.join(newFolderPath, Readme);
      const problemPath = path.join(newFolderPath, problem);
      const inputFilePath = path.join(newFolderPath, "input.txt");

      const fileContent = juseokForm(language, problemData!, number!);
      const ReadmeContent = `# ${number}번: ${problemData!.title}\n\n## 문제\n${
        problemData!.description
      }\n\n## 입력\n${problemData!.input}\n\n## 출력\n${
        problemData!.output
      }\n\n## 예제\n`;
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
        await fs.promises.writeFile(inputFilePath, "");
        await vscode.window.showInformationMessage(
          "Input 파일이 생성되었습니다."
        );
      }

      // 왼쪽 분할 화면에 텍스트 에디터를 열기
      const document = await vscode.workspace.openTextDocument(filePath);
      await vscode.window.showTextDocument(document, {
        viewColumn: vscode.ViewColumn.One,
      });

      // 시각화
      showProblem(number!, problemData, context);
    } catch (err) {
      console.log(err)
      vscode.window.showErrorMessage(
        "파일 생성에 실패했습니다. 다시 시도해주세요."
      );
    }
  }
};

// =================================================================
/**
 * @Title Node.js 프로젝트 초기화
 * @param projectPath
 */

const initializeNodeProject = async (projectPath: string) => {
  console.log(projectPath);

  const packageJsonContent = {
    name: "algorithm",
    version: "1.0.0",
    description: "",
    main: "index.js",
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: [],
    author: "",
    license: "MIT",
  };

  try {
    // package.json 파일 생성
    await fs.promises.writeFile(
      `${projectPath}/package.json`,
      JSON.stringify(packageJsonContent, null, 2)
    );
    vscode.window.showInformationMessage("package.json 파일이 생성되었습니다.");

    // npm install 실행
    exec("npm install", { cwd: projectPath }, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage("npm install에 실패했습니다.");
        console.error(`exec error: ${error}`);
        return;
      }
      vscode.window.showInformationMessage("npm install이 완료되었습니다.");
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  } catch (err) {
    console.error(err);
    vscode.window.showErrorMessage("Node.js 프로젝트 초기화에 실패했습니다.");
  }
};
