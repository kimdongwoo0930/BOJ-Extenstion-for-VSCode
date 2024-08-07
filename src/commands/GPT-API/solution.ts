import { problemData } from "../../types/problemData";
import * as vscode from "vscode";
import { getHtmlFilesInSameFolder } from "../checkTestCase";
import * as path from "path";
import OpenAI from "openai";
import * as fs from "fs";
import { getLangName } from "../../types/fileNameType";

import dotenv from "dotenv";
import { getSolutionForm, markdownForm } from "../../types/solutionForm";
import { getProblemData } from "../../utils/getProblemData";
import { centerText } from "../../utils/makeForm";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * @Title 해설 제공 함수
 * @param context vscode.ExtensionContext
 * @returns
 */
export const getSolution = (context: vscode.ExtensionContext, type: string) => {
  // const apiKey = vscode.workspace
  //   .getConfiguration("BOJ-EX")
  //   .get<string>("GPT-API");
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    vscode.window.showErrorMessage("설정에서 OpenAI API키를 입력해주세요.");
    return;
  }

  // api키가 있다면 일단 문제 번호를 가져와야한다.
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage(
      "해당 문제 코드 창을 띄운 후 실행해 주세요."
    );
    return;
  }
  const document = editor.document;
  const filePath = editor.document.fileName;
  const lang = path.extname(document?.fileName).replace(".", "").trim();

  if (
    lang !== "py" &&
    lang !== "c" &&
    lang !== "cpp" &&
    lang !== "js" &&
    lang !== "java"
  ) {
    vscode.window.showErrorMessage("작성중인 코드 파일을 열고 실행해 주세요.");
    return;
  }

  // 파일명으로 번호 가져오기

  const htmlFiles = getHtmlFilesInSameFolder(document);
  if (htmlFiles.length === 0) {
    vscode.window.showErrorMessage("해당 문제의 HTML 파일을 찾을 수 없습니다.");
    return;
  }
  const number = htmlFiles[0].split(".")[0];

  const langName = getLangName(lang);

  console.log(number);

  getSolutionAPI(apiKey, number, langName, type);
};

let lastHintRequest: number = 0;
const HINT_REQUEST_INTERVAL = 1800000; // 30 minutes
/**
 * @title GPT 한테 해설 물어보기
 * @Description GPT-4o-mini 모델을 사용하여 문제 번호를 통해 해설을 가져오는 함수이다.
 * @쿨타임 30분
 * @토큰 2000토큰
 * @param apiKey api키
 * @param number 문제 번호
 * @param lang 언어
 */
const getSolutionAPI = async (
  apiKey: string,
  number: string,
  lang: string,
  type: string
) => {
  const now = Date.now();
  if (now - lastHintRequest < HINT_REQUEST_INTERVAL) {
    const remainingTime = HINT_REQUEST_INTERVAL - (now - lastHintRequest); // 남은 시간 계산
    const remainingSeconds = Math.max(0, Math.ceil(remainingTime / 1000));
    vscode.window.showInformationMessage(
      "해설 요청은 30분마다 가능합니다.  " +
        `( 남은시간 : ${Math.floor(remainingSeconds / 60)}분 )`
    );
    return;
  }
  lastHintRequest = now;

  // 해설 생성 시작
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "해설 생성중....",
      cancellable: false, // 사용자가 취소할 수 없도록 설정
    },
    async (process) => {
      const client = new OpenAI({
        apiKey: apiKey, // This is the default and can be omitted
      });

      const resultConsole = vscode.window.createOutputChannel("Solution");
      resultConsole.show(true);
      resultConsole.appendLine("-".repeat(50));
      resultConsole.appendLine(centerText(`${number}번 문제 해설`, 48));
      resultConsole.appendLine("-".repeat(50));

      resultConsole.appendLine("질문 생성중....");
      const problemData: problemData = await getProblemData(number);

      const question = getSolutionForm({ number, problemData, language: lang });
      resultConsole.appendLine("질문 생성 완료");
      resultConsole.appendLine("-".repeat(50));

      resultConsole.appendLine("해설 요청중....");

      try {
        const response = await client.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "이 모델은 알고리즘 문제를 해결하는 데 도움을 주거나 해결하는 데 특화되어 있습니다. 최대한 효율적이고 정확한 코드를 제공합니다.",
            },
            { role: "user", content: question },
          ],
          model: type,
          max_tokens: 2000,
        });
        resultConsole.appendLine("해설 요청 완료");

        resultConsole.appendLine("-".repeat(50));
        resultConsole.appendLine("파일 생성중....");
        const content = markdownForm(
          number,
          lang,
          response.choices[0].message.content!
        );

        await makeMarkDownFile(content, resultConsole);
      } catch (error: any) {
        if (error.status === 401) {
          resultConsole.appendLine("OpenAI API키가 잘못되었습니다.");
        } else {
          resultConsole.appendLine("-".repeat(50));
          resultConsole.appendLine("힌트 요청 중 오류 발생:");
          resultConsole.appendLine("-".repeat(50));
          resultConsole.appendLine(error.message || "알 수 없는 오류 발생");
          resultConsole.appendLine("-".repeat(50));
        }
      }
    }
  );
};

/**
 * @title GPT응답을 마크다운 파일로 제작 함수
 * @param content GPT 응답 내용 : ;
 * @returns
 */
const makeMarkDownFile = async (
  content: string,
  resultConsole: vscode.OutputChannel
) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("파일을 열고 다시 시도해주세요.");
    return;
  }

  const document = editor.document;
  const fileDir = path.dirname(document.uri.fsPath);

  if (!fileDir) {
    vscode.window.showErrorMessage("Failed to determine the file directory.");
    return;
  }

  const fileName = "solution.md";
  const filePath = path.join(fileDir, fileName);

  try {
    // Check if the file path is correct
    console.log(`Saving file to: ${filePath}`);

    // Write the content to the file
    await fs.promises.writeFile(filePath, content, "utf8");
    resultConsole.appendLine("파일 생성 완료");
    resultConsole.appendLine("-".repeat(50));

    vscode.window.showInformationMessage(
      `문제 폴더에 solution.md 파일이 생성되었습니다.`
    );
  } catch (error) {
    // Log the error and show a message
    console.error(`Error writing file: ${error}`);
    vscode.window.showErrorMessage(`Error writing markdown file: ${error}`);
  }
};
