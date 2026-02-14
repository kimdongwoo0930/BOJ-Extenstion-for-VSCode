//=====================================================================
//   14501번:    퇴사                   
//   @date:   2026-02-14              
//   @link:   https://www.acmicpc.net/problem/14501  
//   @Motd:   폴더 내부에 있는 파일을 삭제하거나 변경하지 말아주세요.
//   @Test:   코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

#include <iostream>
using namespace std;

#define MAX 16

int N;
int Ti[MAX]={0,};
int Pi[MAX]={0,};
int res[MAX]={0,};

int Max(int a, int b){
	return a>b ? a : b;
}

void Input(){
	cin >> N;
	for (int i=1; i<=N; i++){
		cin >> Ti[i] >> Pi[i];
	}
}

void Dp(){
	int deadline;
	for (int i=N; i>0; i--){
		deadline = i + Ti[i];
		if (deadline > N+1){
			// 상담 불가
			res[i] = res[i+1];
		}
		else {
			// 상담 가능, 최대 이익 판별 필요
			res[i] = Max(res[i+1], res[deadline] + Pi[i]);
		}
	}
}

int main() {
	Input();
	Dp();
	
	cout << res[1] << endl;
	return 0;
}