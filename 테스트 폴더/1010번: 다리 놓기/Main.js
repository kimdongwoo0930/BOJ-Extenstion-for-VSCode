//=====================================================================
//   1010번: 다리 놓기
//   @date:   2024-07-21
//   @link:   https://www.acmicpc.net/problem/1010
//   @Motd:   폴더 내부에 있는 파일을 삭제하지 말아주세요.
//   @method: 코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

const readline = require('readline');
const input = fs.readFileSync('/dev/stdin').toString().trim().split('\n');

const A = parseInt(input.shift()); // 첫번째 값 제거
let num = 0;
function factorial(num) {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
}
for (let i = 0; i < A; i++) {
    const arr = input[i].split(' ');
    const N = parseInt(arr[0]);
    const M = parseInt(arr[1]);
    console.log(Math.round(factorial(M) / (factorial(M - N) * factorial(N))));
}
