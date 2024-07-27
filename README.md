# BOJ Extension for VSCode

BOJ Extension for VSCode은 VS Code에서 백준 온라인 저지 문제를 가져와 공부하고 테스트까지 해볼수 있는 환경을 제공합니다.

### 사용법
1. Extension을 설치 후 `Ctrl + Shift + P` 또는 `Command + Shift + P` 또는 `F1`를 눌러 `Command Palette`를 열어서 `BOJ`를 검색해 설치가 되었는지 확인해주세요.

2. 설치가 되었다면 커멘드를 입력해 사용하면 됩니다.

<br/>

### 명령어

- `BOJ: 문제 가져오기` 
    - 백준 온라인 저지 `문제 번호`, `원하는 개발 언어 확장자`, `폴더 생성 위치`를 입력하면 자동으로 폴더가 생성되고 내부에 파일들이 생성됩니다.
    <br/>

- `BOJ: 테스트`
    - 백준 온라인 저지 문제의 테스트 케이스를 가져와서 해당 테스트 케이스의 `결과`를 보여주고 `채점`해줍니다.
    <br/>

- `BOJ: 문제 보기`
    - 실수로 문제 `Preview`를 닫았을때 다시 문제의 `Preview`를 띄울수 있다.

<br/>

### 지원 언어 및 조건

| Language  | 조건                                                          | 컴파일                                   |
|:---------:|---------------------------------------------------------------|------------------------------------------|
| C11       | GNU C11을 지원하는 `gcc` 컴파일러가 필요합니다.              | `gcc {filePath} -o {file} -std=gnu11`     |
| C++ 17    | C++17 표준을 지원하는 `g++` 컴파일러가 필요합니다.            | `g++ -std=c++17 {filePath} -o {file}`     |
| Js (Node) | Node.js 런타임이 필요합니다.                                    | `node {file}`                            |
| Python    | Python 인터프리터가 필요합니다. `python` 또는 `python3`로 실행 가능 | `python {file}` 또는 `python3 {file}`    |
| Java      | Java Development Kit (JDK)가 필요합니다. 소스 파일을 컴파일하고 실행할 수 있어야 합니다. | `javac {file}` (컴파일), `java {file}` (실행) |

<br/>

### 개발 예정
- README.md 파일에 테스트시 걸린 시간 계산
- 자동 `Github` Commit 및 Push 기능 
- GPT-4 mini API를 통한 문제 해설및 최적화 기능

<br/>

### 피드백 및 버그 리포트

버그 리포트나 피드백은 [GitHub Issues](https://github.com/kimdongwoo0930/BOJ-Extenstion-for-VSCode/issues)에서 제출해 주세요. 피드백을 제공해 주셔서 감사합니다!
