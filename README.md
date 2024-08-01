# BOJ Extension for VSCode

BOJ Extension for VSCode는 VS Code에서 백준 온라인 저지 문제를 가져와 공부하고 테스트할 수 있는 환경을 제공합니다.

### 사용법

1. Extension 설치 후 `Ctrl + Shift + P` 또는 `Command + Shift + P` 또는 `F1`을 눌러 `Command Palette`를 열고 `BOJ`를 검색하여 설치가 완료되었는지 확인해 주세요.

2. 설치가 되었다면 커멘드를 입력해 사용하면 됩니다.

<br/>

### 명령어

-   `BOJ: 파일 생성 및 문제 보기`

    -   백준 온라인 `저지 문제 번호`와 `원하는 개발 언어 확장자`, 그리고 `폴더 생성 위치`를 입력하면 자동으로 폴더가 생성되고, 내부에 문제를 해결하기 위한 필요한 파일들을 생성합니다.
    -   이 명령어를 사용하면 문제 해결을 위한 개발 환경을 신속하게 설정할 수 있습니다.
        <br/>

-   `BOJ: 테스트`

    -   백준 온라인 저지 문제의 테스트 케이스를 가져와서 해당 테스트 케이스에 대한 `결과`를 보여주고, 코드를 자동으로 `채점`합니다.
    -   이 명령어는 문제 해결을 검증할 때 유용하며, 테스트 결과를 즉시 확인할 수 있습니다.
        <br/>

-   `BOJ: 파일 생성없이 문제 보기`

    -   `문제 번호`를 입력받아, `폴더`와 `파일`을 생성하지 않고 문제를 미리보기 형태로 보여줍니다.
    -   이 명령어는 문제를 간단히 확인하고 싶을 때 사용하며, 개발 환경을 설정하지 않고 문제를 빠르게 확인할 수 있습니다.
        <br/>

-   `BOJ: 현재 문제 보기`
    -   코드를 작성하다가 실수로 `문제 미리보기`를 닫았을 때, 이 명령어를 통해 현재 작업 중인 문제를 다시 띄울 수 있습니다.
    -   이 명령어는 작업 중에 `문제 설명`을 다시 확인하고 싶을 때 유용합니다.

<br/>

### 지원 언어 및 조건

|       Language       | 조건                                                                                     | 컴파일                                        |
| :------------------: | ---------------------------------------------------------------------------------------- | --------------------------------------------- |
|         C11          | GNU C11을 지원하는 `gcc` 컴파일러가 필요합니다.                                          | `gcc {filePath} -o {file} -std=gnu11`         |
|        C++ 17        | C++17 표준을 지원하는 `g++` 컴파일러가 필요합니다.                                       | `g++ -std=c++17 {filePath} -o {file}`         |
| JavaScript (Node.js) | Node.js 런타임이 필요합니다.                                                             | `node {file}`                                 |
|        Python        | Python 인터프리터가 필요합니다. `python` 또는 `python3`로 실행 가능                      | `python {file}` 또는 `python3 {file}`         |
|         Java         | Java Development Kit (JDK)가 필요합니다. 소스 파일을 컴파일하고 실행할 수 있어야 합니다. | `javac {file}` (컴파일), `java {file}` (실행) |

<br/>

### 개발 예정

-   README.md 파일에 테스트시 걸린 시간 계산
-   자동 `Github` Commit 및 Push 기능
-   GPT-4 mini API를 통한 문제 해설및 최적화 기능

<br/>

### 피드백 및 버그 리포트

버그 리포트나 피드백은 [GitHub Issues](https://github.com/kimdongwoo0930/BOJ-Extenstion-for-VSCode/issues)에서 제출해 주세요. 피드백을 제공해 주셔서 감사합니다!
