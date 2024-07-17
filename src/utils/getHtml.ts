import * as vscode from "vscode";
import * as cheerio from "cheerio";

export const fetchHtmlData = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text(); // HTML을 텍스트로 변환

    // HTML 문자열을 DOM으로 파싱
    const $ = cheerio.load(html);

    // HTML을 반환해준다.
    return $;
  } catch (error) {
    vscode.window.showErrorMessage("존재하지 않는 문제입니다.");
  }
};
