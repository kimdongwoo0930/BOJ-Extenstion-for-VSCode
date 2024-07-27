import path, { resolve } from "path";
import * as vscode from "vscode";
import { spawn, execSync } from "child_process";
import { getProblemData } from "../utils/getProblemData";
import { problemData } from "../types/problemData";
import * as fs from "fs";
import * as os from 'os';

export const checkTestCase = async (context: vscode.ExtensionContext) => {
  try {
    const editor = vscode.window.activeTextEditor;
    const maxWidth = 50;
    const resultConsole = vscode.window.createOutputChannel("Test Cases");
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return;
    }

    const document = editor.document;
    const filePath = editor.document.fileName;
    const lang = path.extname(document?.fileName).replace(".", "").trim();
    const htmlFiles = getHtmlFilesInSameFolder(document);
    if (htmlFiles.length === 0) {
      vscode.window.showErrorMessage("HTML 파일을 찾을 수 없습니다.");
      return;
    }
    const number = htmlFiles[0].split(".")[0];
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

  return new Promise<void>((resolve,rejects) => {
    let outputs = "";
  if (lang === "js") {
   writeInputTXT(input, filePath, lang);
  }
  const process = processSetting(lang, filePath);

  if (!process) {
    rejects(new Error('Failed to start process'));
    return;
  }

  process.stdout.on("data", (data: Buffer) => {
    outputs += data.toString();
  });

  process.stderr.setEncoding('utf-8');

  // 테스트 오류 시
  process.stderr.on("data", (data: Buffer | string) => {
    // Buffer가 아닌 경우에는 그대로 사용
    const errorOutput = (typeof data === 'string') ? data.trim() : data.toString('utf-8').trim();

    resultConsole.appendLine("-".repeat(50));
    resultConsole.appendLine(`Test Case ${index + 1}: 오류 ⚠️`);
    resultConsole.appendLine("-".repeat(50));
    resultConsole.appendLine(`오류 출력: ${errorOutput}`);
    resultConsole.appendLine("-".repeat(50));
  });


  process.on("close", (code: number) => {
    const output = outputs.trim();
    if (code === 0) {
      resultConsole.appendLine("-".repeat(50));
      resultConsole.appendLine(
        `Test Case ${index + 1}: ${
          output.replace(/\r?\n|\r/g, " ") === resultOutput.trim().replace(/\n/g, " ") ? "성공 ✅" : "실패 ❌"
        }`
      );
      resultConsole.appendLine("-".repeat(50));
      resultConsole.appendLine(`입력: ${input.trim().replace(/\n/g, " ")}`);
      resultConsole.appendLine(
        `예상 출력: ${resultOutput.trim().replace(/\n/g, " ")}`
      );
      resultConsole.appendLine(`실제 출력: ${output.replace(/\r?\n|\r/g, " ")}`);
      resultConsole.appendLine("-".repeat(50));
    }
    resolve();
  });

  // 비동기 작업을 동기처럼 처리
  process.stdin.write(input, "utf-8", (err) => {
    if (err) {
      rejects(err);
      return;
    }
    process.stdin.end(); // 입력 종료
  });
})
}

const processSetting = (lang: string, filePath: string) => {
    // Linux : 리눅스 / Darwin : 맥 / Windows_NT : 윈도우
    const platform = os.type();
    if (lang === "py") {
      if(platform === "Windows_NT"){    return spawn("python", [filePath]);  }
      else {     return spawn("python3", [filePath]); }
    } else if (lang === "c") {
      const file = filePath.replace(/\.[^/.]+$/, "");
      try {
        execSync(`gcc "${filePath}" -o "${file}" -std=gnu11`);
        // execSync(`chmod +x ${filePath}/${file}"`);
        if(platform === "Windows_NT"){
          return spawn('./main', { cwd : path.dirname(filePath) })
        }
        return spawn(`./main`);
      } catch (error) {
        new Error(`컴파일 오류: ${error}`);
      }
    } else if (lang === "cpp") {
      const file = filePath.slice(0, filePath.length - 4);
      try {
        execSync(`g++ -std=c++17 "${filePath}" -o "${file}"`);
        if(platform === "Windows_NT"){
          return spawn('./main', { cwd : path.dirname(filePath) })
        }
        return spawn(`./main`);
      } catch (error) {
        new Error(`컴파일 오류: ${error}`);
      }
    } else if (lang === "java") {
      const dirName = path.dirname(filePath);
      try {
        return spawn(`java`, ["-cp", dirName, filePath]);
      } catch (error) {
        new Error(`컴파일 오류: ${error}`);
      }
    } else if (lang === "js") {
      return spawn("node", [filePath]);
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

// =================================================================================================
/**
 * 자바스크립트인 경우 input.txt를 통해 테스트를 하기위해 input.txt파일에 인풋값을 저장하는 함수를 만들어줘야한다.
 * c언어와 cpp 언어도 임시로 해결될때까지 일단 txt를 통해 테스트를 진행한다.
 *
 */
const writeInputTXT = async (input: string, filePath: string, lang: string) => {
  const folderPath = getFolderPath(filePath);
  const inputFilePath = path.join(folderPath, "input.txt");
  // console.log("Writing to:", inputFilePath);
  // console.log("Input content:", input);

  try {
    fs.writeFileSync(inputFilePath, input);
    // console.log("Input data written to input.txt successfully.");
  } catch (err) {
    await vscode.window.showErrorMessage("input.txt 쓰기에 실패했습니다.");
    console.log(err);
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
