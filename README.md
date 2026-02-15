# BOJ Extension for VSCode

[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/Dong.boj-extension-for-vscode?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=Dong.boj-extension-for-vscode)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/Dong.boj-extension-for-vscode)](https://marketplace.visualstudio.com/items?itemName=Dong.boj-extension-for-vscode)
[![Open VSX](https://img.shields.io/open-vsx/v/Dong/boj-extension-for-vscode?label=Open%20VSX)](https://open-vsx.org/extension/Dong/boj-extension-for-vscode)
[![Language](https://img.shields.io/badge/language-TypeScript-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

[VS Code Marketplace에서 설치하기](https://marketplace.visualstudio.com/items?itemName=Dong.boj-extension-for-vscode) | [Open VSX에서 설치하기](https://open-vsx.org/extension/Dong/boj-extension-for-vscode)

BOJ Extension for VSCode는

> VS Code 내부에서 백준 문제 생성, 테스트, 실행을 자동화하여  
> 알고리즘 학습 생산성을 극대화하는 확장 프로그램입니다.

## 📌 Motivation

백준 문제를 풀 때마다

- 폴더 생성
- 템플릿 작성
- 테스트 코드 복사
- 입력 리다이렉션 설정

이 반복 작업이 비효율적이라고 느꼈습니다.

그래서 VSCode 내부에서
문제 생성 → 테스트까지
한 번에 처리할 수 있는 확장 프로그램을 직접 설계했습니다.

---

## 🏗 Architecture

- VSCode Extension API 기반 Command 등록
- 백준 문제 크롤링 및 파싱
- 로컬 테스트 실행 및 자동 채점

---

## ✨ Core Features

| 기능             | 설명                                 |
| ---------------- | ------------------------------------ |
| 문제 자동 생성   | 번호 입력 시 폴더 + 템플릿 자동 생성 |
| 테스트 자동 실행 | 예제 케이스 자동 채점                |

### 사용법

**방법 1: 사이드바**

1. 왼쪽 Activity Bar에서 BOJ 아이콘을 클릭합니다.
2. 사이드바에서 원하는 기능 버튼을 클릭합니다.

**방법 2: Command Palette**

1. `Ctrl + Shift + P` (Mac: `Command + Shift + P`) 또는 `F1`을 눌러 Command Palette를 엽니다.
2. `BOJ`를 검색하여 원하는 명령어를 실행합니다.

<br/>

---

## 📌 Commands

| Command                     | Description                               | Output              |
| --------------------------- | ----------------------------------------- | ------------------- |
| 🗂 파일 생성 및 문제 보기   | 문제 번호 입력 → 폴더 + 템플릿 자동 생성  | 개발 환경 자동 세팅 |
| 👀 파일 생성 없이 문제 보기 | 문제 미리보기                             | 문제 설명 표시      |
| 🔄 현재 문제 보기           | 현재 문제 다시 보기                       | 문제 설명 표시      |
| 🧪 테스트                   | 예제 테스트 실행                          | 자동 채점 결과      |
| 📤 제출                     | 주석 제거 후 코드 복사 + 제출 페이지 열기 | 백준 제출 페이지    |

## 🛠 Supported Languages

| Language   | Runtime / Requirement                       | Execution Command                     |
| ---------- | ------------------------------------------- | ------------------------------------- |
| C11        | GNU C11 지원 `gcc` 필요                     | `gcc {filePath} -std=gnu11 -o {file}` |
| C++17      | C++17 지원 `g++` 필요                       | `g++ -std=c++17 {filePath} -o {file}` |
| JavaScript | Node.js 런타임 필요                         | `node {file}`                         |
| Python     | Python 인터프리터 (`python` 또는 `python3`) | `python {file}`                       |
| Java       | JDK 필요                                    | `javac {file}` → `java {file}`        |

<br/>

## 🚀 Roadmap

- [x] 사용자 편의 GUI 개발 (사이드바 Welcome View)
- [x] 버그 수정
- [x] 제출 기능 추가
- [x] Marketplace 배포

## 📝 Commit Message Convention

| 타입     | 의미                  | 언제 사용?              | 예시                                       |
| -------- | --------------------- | ----------------------- | ------------------------------------------ |
| feat     | 새로운 기능 추가      | 기능을 새로 만들었을 때 | feat: BOJ 사이드바 아이콘 추가             |
| fix      | 버그 수정             | 오류, 문제 해결         | fix: 아이콘이 하얀 네모로 보이던 문제 수정 |
| refactor | 코드 구조 개선        | 기능 변화 없이 리팩토링 | refactor: icon 로딩 구조 개선              |
| style    | UI / 코드 스타일 변경 | 디자인, 포맷 수정       | style: activity bar icon 크기 조정         |
| docs     | 문서 수정             | README, 주석 변경       | docs: README 사용법 추가                   |
| chore    | 기타 작업             | 설정, 파일명 변경 등    | chore: svg 파일 경로 수정                  |
| perf     | 성능 개선             | 속도, 최적화 작업       | perf: icon 렌더링 최적화                   |

### 피드백 및 버그 리포트

버그 리포트나 피드백은 [GitHub Issues](https://github.com/kimdongwoo0930/BOJ-Extenstion-for-VSCode/issues)에서 제출해 주세요. 피드백을 제공해 주셔서 감사합니다!
