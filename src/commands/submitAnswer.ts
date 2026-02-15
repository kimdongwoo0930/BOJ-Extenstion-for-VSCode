import * as vscode from "vscode";
import * as path from "path";

/**
 * @TItle 문제 제출 함수
 * @description 백준 사이트에 문제를 제출하기위한 함수
 * @param context vscode.ExtensionContext
 */

export const submitAnswer = async (context: vscode.ExtensionContext) => {
  // 1. 현재 열린 파일 가져오기
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("열려 있는 파일이 없습니다.");
    return;
  }
  // 2. 폴더명에서 문제 번호 추출 ("1001번 - 제목" → "1001")
  const filePath = editor.document.uri.fsPath;
  const folderName = path.basename(path.dirname(filePath));
  const problemNumber = folderName.split("번")[0];

  if (!problemNumber || isNaN(Number(problemNumber))) {
    vscode.window.showErrorMessage("문제 번호를 찾을 수 없습니다.");
    return;
  }

  // 3. 코드 복사
  const code = editor.document.getText();
  const ext = path.extname(filePath).slice(1); // "py", "cpp" 등

  let cleaned = code;
  if (ext === "py") {
    cleaned = code.replace(/#.*$/gm, "").replace(/^\s*\n/gm, "");
  } else {
    // c, cpp, java, js
    cleaned = code
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\n/gm, "");
  }

  await vscode.env.clipboard.writeText(cleaned);

  // 4. 백준 제출 페이지 열기
  const submitUrl = `https://www.acmicpc.net/submit/${problemNumber}`;
  await vscode.env.openExternal(vscode.Uri.parse(submitUrl));

  vscode.window.showInformationMessage(
    `${problemNumber}번 코드가 복사되었습니다. 제출 페이지에서 붙여넣기 해주세요.`,
  );
};
