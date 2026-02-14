# =====================================================================
#   14501번:    퇴사
#   @date:   2026-02-14
#   @link:   https://www.acmicpc.net/problem/14501
#   @Motd:   폴더 내부에 있는 파일을 삭제하거나 변경하지 말아주세요.
#   @Test:   코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
# =====================================================================

import sys

input = sys.stdin.readline


N = int(input())
TP = [list(map(int, input().split())) for _ in range(N)]
dp = [0 for _ in range(N + 1)]

for i in range(N - 1, -1, -1):
    if i + TP[i][0] > N:
        dp[i] = dp[i + 1]
    else:
        dp[i] = max(dp[i + 1], dp[i + TP[i][0]] + TP[i][1])
print(dp[0])
