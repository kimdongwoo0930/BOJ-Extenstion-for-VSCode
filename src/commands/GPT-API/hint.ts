import * as vscode from "vscode";
import { getHtmlFilesInSameFolder } from "../checkTestCase";

export const getHint = (context: vscode.ExtensionContext) => {
  const apiKey = vscode.workspace
    .getConfiguration("BOJ-EX")
    .get<string>("GPT-API");

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

  // 파일명으로 번호 가져오기

  const document = editor.document;
  const filePath = editor.document.fileName;
  const htmlFiles = getHtmlFilesInSameFolder(document);
  if (htmlFiles.length === 0) {
    vscode.window.showErrorMessage("해당 문제의 HTML 파일을 찾을 수 없습니다.");
    return;
  }
  const number = htmlFiles[0].split(".")[0];

  //   console.log(number);
  
};
