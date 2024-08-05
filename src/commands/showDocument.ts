import * as vscode from "vscode";
import path from "path";
import { ProblemNumberInputValidation } from "../types/validation";
import { problemData } from "../types/problemData";
import { getProblemData } from "../utils/getProblemData";
import { showProblem, showProblemToHtml } from "./showProblemDocument";
import { getHtmlContent, getHtmlFilesInSameFolder } from "../utils/getHtml";

/**
 * @title html파일이 필요없이 번호를 통해 문제를 보여주는 함수
 */
export const showDocumentWithoutFile = (context: vscode.ExtensionContext) => {
  // 문제 번호를 입력받는다?
  // 혹은 지금 열고있는 파일은 안열고 있을 수 도 있으니.
  // 문제 번호를 입력받는 쪽으로 가자.
  vscode.window
    .showInputBox({
      title: "문제 번호를 입력해 주세요.",
      placeHolder: "ex) 1001",
    })
    .then(async (number) => {
      if (!ProblemNumberInputValidation(number)) {
        vscode.window.showErrorMessage("올바른 번호를 입력해주세요.");
        showDocumentWithoutFile(context);
        return;
      }
      // ProblemData도 만들어줘야한다.
      const problemData: problemData | void = await getProblemData(number);
      if (problemData === undefined) {
        vscode.window.showErrorMessage("문제를 가져오는데 실��했습니다.");
        return;
      }
      // 문제를 showProblemDocument로 넘겨주면 된다.
      showProblem(number, problemData, context);
    });
};

/**
 * @title 현재 열린 파일을 통해 문제를 보여주는 함수
 */
export const showDocument = async (context: vscode.ExtensionContext) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("코드 파일을 열고 실행해 주세요.");
    return;
  }
  const document = editor.document;
  const filePath = document.fileName;
  const folderPath = path.dirname(filePath);
  // 같은 폴더에 있는 HTML 파일 찾기
  const htmlFiles = getHtmlFilesInSameFolder(document);
  if (htmlFiles.length === 0) {
    vscode.window.showErrorMessage("HTML 파일을 찾을 수 없습니다.");
    return;
  }
  const htmlFilePath = htmlFiles[0];

  // console.log(htmlFilePath);

  try {
    const htmlFilePath = htmlFiles[0];
    const htmlContent = await getHtmlContent(htmlFilePath);
    // console.log(htmlContent);

    showProblemToHtml(htmlContent, context);
  } catch (error) {
    vscode.window.showErrorMessage(`HTML을 가져오는데 실패했습니다.`);
  }
};
