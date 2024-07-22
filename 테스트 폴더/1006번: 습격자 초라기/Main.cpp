//=====================================================================
//   1006번: 습격자 초라기                   
//   @date:   2024-07-21              
//   @link:   https://www.acmicpc.net/problem/1006  
//   @Motd:   폴더 내부에 있는 파일을 삭제하지 말아주세요.
//   @method: 코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

#include <iostream>
using namespace std;
            
#include <cstring>
#include <cmath>
#include <algorithm>

using namespace std;

int map[10000][2];
int dp[10000][4][4];
int n, w;
/*
	0 -> not used, 
	1 -> inner used, 
	2 -> outer used, 
	3 -> both used
*/

int solution(int index, int prev, int last)
{
	int& result = dp[index][prev][last];
	if (result) return result;
	bool inner, outer, both;
	// 이전 블록 (index - 1)과 묶을 수 있는지 판별
	inner = (map[index][0] + map[index ? index - 1 : n - 1][0] <= w);
	outer = (map[index][1] + map[index ? index - 1 : n - 1][1] <= w);
	// 안밖이 묶일 수 있는지 확인
	both = (map[index][0] + map[index][1] <= w);
	// index가 끝에 도달했을 때
	if (index == n - 1) {
		if (index == 0) return both ? 1 : 2;

		// 최소 2개의 팀이 필요하다.
		result = 2;
		if (last == 0) {
			if (inner && !(prev & 1)) result = 1;
			if (outer && prev < 2) result = 1;
			if (both) result = 1;
			if (inner && outer && prev == 0) result = 0;
		}
		else if (last == 1) {
			if (outer && prev < 2) result = 1;
		}
		else if (last == 2) {
			if (inner && !(prev & 1)) result = 1;
		}
		return result;
	}
	// 구역을 묶지 않을 때 ( 최소 2개의 팀 필요 )
	result = 2 + solution(index + 1, 0, index ? last : 0);
	// 안쪽 구역을 묶을 때
	if (inner && !(prev & 1)) result = min(result, 1 + solution(index + 1, 1, index ? last : 1));
	// 바깥 구역을 묶을 때
	if (outer && prev < 2) result = min(result, 1 + solution(index + 1, 2, index ? last : 2));
	// 안쪽과 바깥 구역을 각각 묶을 때 , 팀이 더 필요하지 않다.
	if (inner && outer && prev == 0) result = min(result, solution(index + 1, 3, index ? last : 3));
	// 안쪽과 바깥 구역을 함께 묶을 때
	if (both) result = min(result, 1 + solution(index + 1, 3, index ? last : 0));
	return result;
}
int main()
{
	int c; scanf("%d", &c);
	while (c--) {

		memset(map, 0, sizeof(map));
		memset(dp, 0, sizeof(dp));
		scanf("%d%d", &n, &w);
		for (int i = 0; i < n; i++) scanf("%d", &map[i][0]);
		for (int i = 0; i < n; i++) scanf("%d", &map[i][1]);
		printf("%d\n", solution(0, 0, 0));
	}
}