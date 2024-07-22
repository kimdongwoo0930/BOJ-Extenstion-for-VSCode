//=====================================================================
//   3005번: 크로스워드 퍼즐 쳐다보기                   
//   @date:   2024-07-21              
//   @link:   https://www.acmicpc.net/problem/3005  
//   @Motd:   폴더 내부에 있는 파일을 삭제하지 말아주세요.
//   @method: 코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX 100

// 함수 선언
void processInput(char board[MAX][MAX], int rows, int cols, char word[MAX]);
void printWord(char board[MAX][MAX], int rows, int cols, char word[MAX]);

int main() {
    int rows, cols;
    scanf("%d %d", &rows, &cols);

    // 보드 배열과 단어 배열 초기화
    char board[MAX][MAX];
    char word[MAX];

    // 보드 배열 입력
    for (int i = 0; i < rows; i++) {
        scanf("%s", board[i]);
    }

    // 단어 배열 입력
    scanf("%s", word);

    // 입력된 단어를 처리하여 결과를 출력합니다.
    processInput(board, rows, cols, word);
    return 0;
}

void processInput(char board[MAX][MAX], int rows, int cols, char word[MAX]) {
    // 단어를 출력하기 위해서 보드의 상태를 검색합니다.
    // 현재는 간단히 단어를 출력하는 로직만 포함되어 있습니다.
    printWord(board, rows, cols, word);
}

void printWord(char board[MAX][MAX], int rows, int cols, char word[MAX]) {
    printf("해결된 단어: %s\n", word);
}