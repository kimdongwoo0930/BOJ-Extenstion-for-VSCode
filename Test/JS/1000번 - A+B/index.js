//=====================================================================
//   1000번: A+B
//   @date:   2026-02-14
//   @link:   https://www.acmicpc.net/problem/1000
//   @Motd:   폴더 내부에 있는 파일을 삭제하거나 변경하지 말아주세요.
//   @Test:   코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================


const fs = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "input.txt");

// 줄 단위로 받기
const input = fs.readFileSync(inputFilePath, "utf8").trim().split(" ");

const a = parseInt(input[0]);
const b = parseInt(input[1]);
console.log(a + b);
