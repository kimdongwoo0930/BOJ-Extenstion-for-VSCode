// 모듈 'vscode'에 VS 코드 확장성 API가 포함되어 있습니다
// 모듈을 가져와 아래 코드의 별칭 vscode와 함께 참조합니다
import * as vscode from "vscode";
// import { checkProblemNumber } from './utils/checkProblemNumber';

import { InputProblemNumber } from "./commands/getProblemByNumber";
import { checkTestCase } from "./commands/checkTestCase";
import { showDocument, showDocumentWithoutFile } from "./commands/showDocument";
import { BojTreeProvider } from "./views/bojView";

// 확장이 활성화되면 이 메서드가 호출됩니다
// 명령이 처음 실행될 때 확장이 활성화됩니다
export function activate(context: vscode.ExtensionContext) {
  // 콘솔을 사용하여 진단 정보(console.log) 및 오류(console.error)를 출력합니다
  // 이 코드 라인은 내선번호가 활성화될 때 한 번만 실행됩니다
  console.log("익스텐션이 실행되었습니다.");

  /**
   * 문제 번호를 통해서 가져오는 커멘드 함수
   * Description :
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "boj-extension-for-vscode.getProblemByNumber",
      () => {
        InputProblemNumber(context);
      },
    ),
  );
  /**
   * 테스트 커멘드
   */

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "boj-extension-for-vscode.checkTestCase",
      () => {
        checkTestCase(context);
      },
    ),
  );

  /**
   * 문제 다시보기 ( html파일 없이 )
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "boj-extension-for-vscode.showProblemWithdoutFile",
      () => {
        showDocumentWithoutFile(context);
        //vscode.window.showInformationMessage("문제 다시보기");
      },
    ),
  );
  /**
   * 현재 풀고 있는 문제 보기
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "boj-extension-for-vscode.showProblem",
      () => {
        showDocument(context);
      },
    ),
  );
  /**
   * GUI 생성
   */
  const provider = new BojTreeProvider();

  context.subscriptions.push(
    vscode.commands.registerCommand("boj.refreshView", () =>
      provider.refresh(),
    ),
  );
}

// 이 메소드는 해당 익스텐션이 종료될때 실행됩니다.
export function deactivate() {}
