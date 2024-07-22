import path from "path";
import * as vscode from "vscode";
import { spawn, execSync } from "child_process";
import { getProblemData } from "../utils/getProblemData";
import { problemData } from "../types/problemData";
import * as fs from "fs";

export const checkTestCase = async (context: vscode.ExtensionContext) => {
  try {
    const editor = vscode.window.activeTextEditor;
    const maxWidth = 40;
    const resultConsole = vscode.window.createOutputChannel("Test Cases");
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return;
    }

    const document = editor.document;
    const filePath = editor.document.fileName;
    const lang = path.extname(document?.fileName).replace(".", "").trim();
    const number = getHtmlFilesInSameFolder(document)[0].split(".")[0];
    console.log();
    console.log(`확장자 : ${lang}`);
    console.log(`문제 번호 : ${number}`);

    if (
      lang === "py" ||
      lang === "c" ||
      lang === "cpp" ||
      lang === "js" ||
      lang === "java"
    ) {
      console.log("available languages");

      // 문제 가져오기
      // const url = `https://www.acmicpc.net/problem/${number}`;
      const problemData: problemData | null = await getProblemData(number);
      if (problemData === null) {
        vscode.window.showErrorMessage("문제를 가져오는데 실패했습니다.");
        return;
      }

      // 메세지 띄우기
      const message_1 = centerText(
        `${number}번: ${problemData!.title}`,
        maxWidth
      );
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
      vscode.window.showErrorMessage("테스트할 파일을 열고 실행해 주세요.");
    }
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage("오류 발생 다시 실행해주세요.");
  }
};

// =================================================================

const runCommand = async (
  lang: string,
  filePath: string,
  input: string,
  resultOutput: string,
  resultConsole: vscode.OutputChannel,
  index: number
) => {
  try {
    const process = await processSetting(lang, filePath);

    if (!process) {
      vscode.window.showErrorMessage("지원하지 않는 언어입니다.");
      return;
    }

    let outputs = "";
    // 테스트 결과
    process.stdout.on("data", (data: Buffer) => {
      outputs += data.toString();
    });

    // 테스트 오류 시
    process.stderr.on("data", (data: Buffer | string) => {
      const errorOutput = data.toString().trim();
      resultConsole.appendLine("-".repeat(40));
      resultConsole.appendLine(`Test Case ${index + 1}: 오류`);
      resultConsole.appendLine("-".repeat(40));
      resultConsole.appendLine(`오류 출력: ${errorOutput}`);
      resultConsole.appendLine("-".repeat(40));
    });

    // 테스트 종료 시 ?
    process!.on("close", (code: number) => {
      const output = outputs.trim();
      if (code === 0) {
        resultConsole.appendLine("-".repeat(40));
        resultConsole.appendLine(
          `Test Case ${index + 1}: ${
            output === resultOutput.trim() ? "성공" : "실패"
          }`
        );
        resultConsole.appendLine("-".repeat(40));
        resultConsole.appendLine(`입력: ${input.trim().replace(/\n/g, " ")}`);
        resultConsole.appendLine(
          `예상 출력: ${resultOutput.trim().replace(/\n/g, " ")}`
        );
        resultConsole.appendLine(`실제 출력: ${output.replace(/\n/g, " ")}`);
        resultConsole.appendLine("-".repeat(40));
      }
      return;
    });

    // 비동기 작업을 동기처럼 처리
    await new Promise<void>((resolve, reject) => {
      process.stdin.write(input, "utf-8", (err: Buffer) => {
        if (err) {
          reject(err);
        }
      });
      process.stdin.end();
      process.on("close", () => resolve());
    });
  } catch (error) {
    resultConsole.appendLine(
      `테스트 케이스 ${index} 실행 중 오류 발생: ${error}`
    );
  }
};

const processSetting = (lang: string, filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (lang === "py") {
      resolve(spawn("python3", [filePath]));
    } else if (lang === "c") {
      const file = filePath.replace(/\.[^/.]+$/, "");
      try {
        execSync(`gcc "${filePath}" -o "${file}"`);
        resolve(spawn(`./${file}`));
      } catch (error) {
        reject(new Error(`컴파일 오류: ${error}`));
      }
    } else if (lang === "cpp") {
      const file = filePath.replace(/\.[^/.]+$/, "");
      try {
        execSync(`g++ -std=c++17 "${filePath}" -o "${file}"`);
        resolve(spawn(`./${file}`));
      } catch (error) {
        reject(new Error(`컴파일 오류: ${error}`));
      }
    } else if (lang === "java") {
      const dirName = path.dirname(filePath);
      try {
        resolve(spawn(`java`, ["-cp", dirName, filePath]));
      } catch (error) {
        reject(new Error(`컴파일 오류: ${error}`));
      }
    } else if (lang === "js") {
      resolve(spawn("node", [filePath]));
    } else {
      reject(new Error(`Unsupported language: ${lang}`));
    }
  });
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
  return (
    "=".repeat(paddingLeft - 1) +
    " " +
    text +
    " " +
    "=".repeat(paddingRight - 1)
  );
}

const getHtmlFileNames = (folderPath: string): string[] => {
  try {
    const files = fs.readdirSync(folderPath);
    // HTML 파일만 필터링
    return files.filter((file) => path.extname(file) === ".html");
  } catch (error) {
    console.error(`폴더를 읽는 중 오류 발생: ${error}`);
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
