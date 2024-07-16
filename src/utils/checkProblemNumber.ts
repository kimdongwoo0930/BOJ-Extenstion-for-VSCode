// 백준 마지막 페이지에 있는 문제 번호를 가지고 와서 입력받은 숫자와 비교를 해보자.
// https://www.acmicpc.net/problemset?sort=no_desc

import { JSDOM } from "jsdom";

export const checkProblemNumber = async (
  number: string | undefined
): Promise<boolean> => {
  if (number === undefined) {
    return false;
  }

  const url = "https://www.acmicpc.net/problemset?sort=no_desc";

  try {
    // Cheerio를 사용하여 HTML 파싱
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    // 응답 데이터를 문자열로 변환
    // const htmlString = await response.text();
    // // HTML 문자열을 파싱하여 DOM 객체 생성
    // const dom = new JSDOM(htmlString);
    // const document = dom.window.document;

    // // <td> 태그들을 가져오기
    // const tdElements = document.querySelectorAll("td");

    // // 각 <td> 태그의 내용을 출력
    // tdElements.forEach((td, index) => {
    //   console.log(`TD ${index + 1}: ${td.textContent}`);
    // });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
