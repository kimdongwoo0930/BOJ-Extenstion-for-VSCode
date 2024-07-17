import * as vscode from "vscode";
import { fetchHtmlData } from "../utils/getHtml";
import path from "node:path";
import * as fs from "fs";
import { problemData } from "../types/problemData";

// 입문한 문제 번호와 사용자가 선택한 언어의 확장자를 받아서 파일을 생성해주는 함수를 만들어야한다.
export const getProblem = async (
  number: string | undefined,
  language: string,
  context: vscode.ExtensionContext
) => {
  if (number === undefined) {
    return;
  }
  const url = `https://www.acmicpc.net/problem/${number}`;
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "로딩 중...",
      cancellable: false, // 사용자가 취소할 수 없도록 설정
    },
    async (progress) => {
      const $ = await fetchHtmlData(url);

      if ($) {
        // 문제 제목
        const title: string = $("#problem_title").text();
        // 문제 정보
        const info = $("#problem-info").html();
        // 문제 본문
        const description = $("#problem_description")
          .html()!
          .replace(/\t/g, "");

        // 입력, 출력, 예제 입력, 예제 출력 추출
        const input = $("#problem_input").html()!.replace(/\t/g, "");
        const output = $("#problem_output").html()!.replace(/\t/g, "");

        // 제한 추출
        const limit = $("#problem_limit").html();

        // 예제 입력, 예제 출력, 예제 설명 추출 (배열로 처리)
        const testCaseInputs: string[] = [];
        const testCaseOutputs: string[] = [];
        const testCaseExplains: string[] = [];

        let index = 1;
        while (true) {
          const testCaseInput = $(`#sample-input-${index}`).html();
          const testCaseOutput = $(`#sample-output-${index}`).html();
          const testCaseExplain = $(`#sample_explain_${index}`).html();

          if (!testCaseInput || !testCaseOutput) {
            break;
          }

          testCaseInputs.push(testCaseInput);
          testCaseOutputs.push(testCaseOutput);
          if (testCaseExplain) {
            testCaseExplains.push(testCaseExplain);
          }
          index++;
        }

        // 힌트 추출
        const hint = $("#problem_hint").html();

        // 출처 추출
        const source = $("#source").html();

        const problemData: problemData = {
          number,
          title,
          info,
          description,
          input,
          output,
          limit,
          testCaseInputs,
          testCaseOutputs,
          testCaseExplains,
          hint,
          source,
        };

        console.log(problemData);

        /**
         * 유저가 원하는 폴더위치에 문제 폴더를 생성한다.
         */
        // let options = {
        //   canSelectMany: false,
        //   openLabel: "Select",
        //   canSelectFolders: true,
        //   canSelectFiles: false,
        // };
        // const folder = await vscode.window.showOpenDialog(options);

        // if (folder && folder[0]) {
        //   let selectedFolderPath = folder[0].fsPath;

        //   const folderName = `${number}: ${title}`;

        //   let newFolderPath = path.join(selectedFolderPath, folderName);

        //   fs.access(newFolderPath, fs.constants.F_OK, (err) => {
        //     if (!err) {
        //       vscode.window.showErrorMessage(
        //         "해당 문제 폴더가 이미 존재합니다."
        //       );
        //     } else {
        //       // 폴더 생성
        //       fs.mkdir(newFolderPath, { recursive: true }, (err) => {
        //         if (err) {
        //           vscode.window.showErrorMessage(
        //             "Error creating folder: " + err.message
        //           );
        //         } else {
        //           vscode.window.showInformationMessage(
        //             "문제 폴더가 생성되었습니다."
        //           );
        //         }
        //       });
        //     }
        //   });
        // 폴더 생성 완료
        // =================================================================
      }
      // 문제 파일 생성
    }
  );

  // 해당문제 데이터 가져오기
};
