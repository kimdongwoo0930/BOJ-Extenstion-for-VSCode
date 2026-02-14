//=====================================================================
//   14501번: 퇴사
//   @date:   2026-02-14
//   @link:   https://www.acmicpc.net/problem/14501
//   @Motd:   폴더 내부에 있는 파일을 삭제하거나 변경하지 말아주세요.
//   @Test:   코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

const fs = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "input.txt");

const input = fs.readFileSync(inputFilePath, "utf8").trim().split(/\r?\n/);
const N = +input.shift();
const payChart = input.map((info) => info.split(" ").map((val) => +val));

const getMaxPay = () => {
  let max = -Infinity;

  const dfs = (idx, total) => {
    max = Math.max(max, total);

    for (let i = idx; i < N; i++) {
      const [time, pay] = payChart[i];
      const nextWorkDay = i + time;

      dfs(nextWorkDay, nextWorkDay > N ? total : total + pay);
    }

    return max;
  };

  return dfs(0, 0);
};

console.log(getMaxPay());
