// 모듈 'vscode'에 VS 코드 확장성 API가 포함되어 있습니다
// 모듈을 가져와 아래 코드의 별칭 vscode와 함께 참조합니다
import * as vscode from "vscode";
import { checkProblemNumber } from "./utils/checkProblemNumber";
import { ProblemNumberInputValidation } from "./utils/validation";
import { todo } from "node:test";
import { getProblem } from "./commands/getProblemByNumber";

// 확장이 활성화되면 이 메서드가 호출됩니다
// 명령이 처음 실행될 때 확장이 활성화됩니다
export function activate(context: vscode.ExtensionContext) {
  // 콘솔을 사용하여 진단 정보(console.log) 및 오류(console.error)를 출력합니다
  // 이 코드 라인은 내선번호가 활성화될 때 한 번만 실행됩니다
  console.log("익스텐션이 실행되었습니다.");

  // package.json 파일에 명령이 정의되었습니다
  // 이제 registerCommand로 명령 구현을 제공합니다
  // commandId 매개 변수는 package.json의 명령 필드와 일치해야 합니다
  const disposable = vscode.commands.registerCommand(
    "boj-extension-for-vscode.helloWorld",
    () => {
      // 여기에 두는 코드는 명령이 실행될 때마다 실행됩니다
      // 사용자에게 메시지 상자 표시
      vscode.window.showInformationMessage(
        "Hello World from BOJ Extension for VSCode!"
      );
    }
  );

  context.subscriptions.push(disposable);

  /**
   * 문제 번호를 통해서 가져오는 커멘드 함수\
   * Description :
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "boj-extension-for-vscode.getProblemByNumber",
      () => {
        const getProblemByNumber = () => {
          // 실행될 함수
          vscode.window.showInformationMessage("테스트 성공");
          // 문제 번호를 받을 입력창 만들기
          vscode.window
            .showInputBox({
              title: "문제 번호를 입력해 주세요.",
              prompt: "숫자만 입력해주시면 됩니다.",
              placeHolder: "ex) 1001",
            })
            .then((problemNumber) => {
              // 먼저 입력받은 값의 검증해야한다.
              if (ProblemNumberInputValidation(problemNumber)) {
                // 만약 문제가 존재한다면 이제 사용할 언어의 확장자를 입력받아야한다.
                const getInputLanguage = () => {
                  vscode.window
                    .showInputBox({
                      title: "사용할 언어의 확장자를 입력해주세요.",
                      prompt: "사용 가능 언어 : c, cpp, py, js, java",
                      placeHolder: "ex) py",
                    })
                    .then((languageInput) => {
                      languageInput = languageInput?.trim();
                      if (
                        languageInput === "c" ||
                        languageInput === "cpp" ||
                        languageInput === "js" ||
                        languageInput === "py" ||
                        languageInput === "java"
                      ) {
                        // 이제 문제 파일 생성 함수 제작
                        getProblem(problemNumber, languageInput, context);
                      }
                      // 사용 가능한 확장자가 아닐경우
                      else {
                        vscode.window.showErrorMessage(
                          "사용 불가능한 확장자입니다."
                        );
                        getInputLanguage();
                      }
                    });
                };
                getInputLanguage();
              } else {
                vscode.window.showErrorMessage("올바른 번호를 입력해주세요.");
                getProblemByNumber();
              }
            });
        };
        // 함수 실행
        getProblemByNumber();
      }
    )
  );
}

// 이 메소드는 해당 익스텐션이 종료될때 실행됩니다.
export function deactivate() {}
