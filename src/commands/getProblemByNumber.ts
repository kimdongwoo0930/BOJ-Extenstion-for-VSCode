import * as vscode from "vscode";
import { problemData } from "../types/problemData";
import { getProblemData } from "../utils/getProblemData";

import { ProblemNumberInputValidation } from "../types/validation";
import { makeFolder } from "../utils/makeFolder";

// =================================================================================================
// After Repactoring
/**
 * @Title 문제 번호 입력 함수
 * @param context vscode.ExtensionContext
 */
export const InputProblemNumber = (context: vscode.ExtensionContext) => {
  // 실행될 함수
  // 문제 번호를 받을 입력창 만들기
  vscode.window
    .showInputBox({
      title: "문제 번호를 입력해 주세요.",
      prompt: "숫자만 입력해주세요.",
      placeHolder: "ex) 1001",
    })
    .then((problemNumber) => {
      // ESC 또는 빈ㄱ칸으로 취소 했을경우
      if (problemNumber === undefined) {
        return;
      }

      // 먼저 입력받은 값의 검증해야한다.
      if (ProblemNumberInputValidation(problemNumber)) {
        InputLanguage(context, problemNumber);
      } else {
        vscode.window.showErrorMessage("올바른 번호를 입력해주세요.");
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
const InputLanguage = async (
  context: vscode.ExtensionContext,
  number: string,
) => {
  const languages = [
    { label: "C", ext: "c" },
    { label: "C++", ext: "cpp" },
    { label: "JavaScript", ext: "js" },
    { label: "Python", ext: "py" },
    { label: "Java", ext: "java" },
  ];

  const selected = await vscode.window.showQuickPick(languages, {
    placeHolder: "사용하실 언어를 선택해주세요.",
  });

  if (!selected) return;

  getProblem(number, selected.ext, context);
};
// =================================================================================================

/**
 *
 * @param number 문제 번호
 * @param language 확장자 명
 * @param context vscode.ExtensionContext
 */

const getProblem = async (
  number: string,
  language: string,
  context: vscode.ExtensionContext,
) => {
  const problemData: problemData | void = await getProblemData(number);
  //   console.log(problemData);

  /**
   * 유저가 원하는 폴더위치에 문제 폴더를 생성한다.
   */
  let options = {
    canSelectMany: false,
    openLabel: "Select",
    canSelectFolders: true,
    canSelectFiles: false,
  };
  const folder = await vscode.window.showOpenDialog(options);
  if (!folder?.[0]) {
    return;
  }

  if (folder && folder[0]) {
    makeFolder(folder, number, language, problemData, context);
  }

  // 해당문제 데이터 가져오기
};
