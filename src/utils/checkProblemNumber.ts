// // 백준 마지막 페이지에 있는 문제 번호를 가지고 와서 입력받은 숫자와 비교를 해보자.
// // https://www.acmicpc.net/problemset?sort=no_desc

// =================================================================
// 성능문제로 사용안하기로 했다
// =================================================================

/** 
import vscode from "vscode";

export const checkProblemNumber = async (
  number: string | undefined
): Promise<boolean> => {
  if (number === undefined) {
    return false;
  }

  const InputNumber = parseInt(number.trim(), 10);
  if (InputNumber < 1000) {
    return false;
  }

  const url = "https://www.acmicpc.net/problemset?sort=no_desc";

  // 불러오는동안 로딩 화면 만들기
  return await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "로딩 중...",
      cancellable: false, // 사용자가 취소할 수 없도록 설정
    },
    async (progress) => {
      // 실제 데이터 가져오기
      const $ = await fetchHtmlData(url);

      if ($) {
        const lastNum = parseInt($("td:first").text().trim(), 10);
        console.log(InputNumber, lastNum);

        if (InputNumber <= lastNum) {
          return true;
        }
        return false;
      }
      return false;
    }
  );
};
*/
