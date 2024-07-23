import * as vscode from "vscode";
import { ProblemNumberInputValidation } from "../types/validation";
import { problemData } from "../types/problemData";
import { getProblemData } from "../utils/getProblemData";
import { showProblem } from "./showProblemDocument";
export const showDocument = (context: vscode.ExtensionContext) => {
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
        showDocument(context);
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
