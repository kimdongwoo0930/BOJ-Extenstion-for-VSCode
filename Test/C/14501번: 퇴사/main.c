//=====================================================================
//   14501번:    퇴사                  
//   @date:   2026-02-14              
//   @link:   https://www.acmicpc.net/problem/14501  
//   @Motd:   폴더 내부에 있는 파일을 삭제하거나 변경하지 말아주세요.
//   @Test:   코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

#include<stdio.h>

int n, answer;
int arr[15][2];

void value_dfs(int start, int sum) {
	if (start > n) return;
	if (answer < sum) {
		answer = sum;
	}
	for (int i = start; i < n; i++) {
		value_dfs(i + arr[i][0], sum + arr[i][1]);
	}
}

int main() {
	scanf("%d", &n);
	for (int i = 0; i < n; i++) {
		scanf("%d %d", &arr[i][0], &arr[i][1]);
	}
	value_dfs(0, 0);
	printf("%d\n", answer);
	return 0;
}