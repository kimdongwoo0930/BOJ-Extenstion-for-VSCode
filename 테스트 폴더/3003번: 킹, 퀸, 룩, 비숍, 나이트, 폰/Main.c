//=====================================================================
//   3003번: 킹, 퀸, 룩, 비숍, 나이트, 폰                   
//   @date:   2024-07-21              
//   @link:   https://www.acmicpc.net/problem/3003  
//   @Motd:   폴더 내부에 있는 파일을 삭제하지 말아주세요.
//   @method: 코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(void){
    int K, Q, R, B, N, P;
    scanf("%d %d %d %d %d %d", &K, &Q, &R, &B, &N, &P);
 
    printf("%d %d %d %d %d %d\n", 1-K, 1-Q, 2-R, 2-B, 2-N, 8-P);
    return 0;
}

