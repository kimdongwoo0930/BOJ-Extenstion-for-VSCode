# VS 코드 확장에 오신 것을 환영합니다

## 폴더에 있는 내용

- 이 폴더에는 확장에 필요한 모든 파일이 들어 있습니다.
- "package.json" - 확장자와 명령어를 선언하는 매니페스트 파일입니다.
  - 샘플 플러그인은 명령어를 등록하고 해당 명령어의 제목과 명령어 이름을 정의합니다. 이 정보로 VS Code는 명령어 팔레트에 명령어를 표시할 수 있습니다. 아직 플러그인을 로드할 필요가 없습니다.
- 'src/extension.ts' - 명령 구현을 제공할 메인 파일입니다.
  - 파일은 activate라는 하나의 기능을 내보냅니다. activate 기능 안에서는 register Command라고 부릅니다.
  - 명령의 구현이 포함된 함수를 두 번째 매개 변수인 'register Command'로 전달합니다.

## 설정

- 권장 확장(amodio.tsl-problem-matcher, ms-vscode.extension-test-runner, dbaemer.vscode-eslint)을 설치합니다

## 바로 실행하기

- F5를 눌러 내선번호가 로드된 새 창을 엽니다.
- 명령 팔레트에서 ('Ctrl+Shift+P' 또는 'Cmd+Shift+P'를 Mac에서) 누르고 Hello World를 입력하여 명령을 실행합니다.
- 코드의 'src/extension.ts' 내에서 중단점을 설정하여 확장을 디버깅합니다.
- 디버그 콘솔에서 확장에서 출력을 찾습니다.

## 변경합니다

- 'src/extension.ts'에서 코드를 변경한 후 디버그 도구 모음에서 확장을 다시 시작할 수 있습니다.
- 또한 내선번호와 함께 VS Code 창을 새로고침('Ctrl+R' 또는 'Cmd+R')하여 변경사항을 로드할 수 있습니다.

## API 탐색

- 'node_modules/@type/vscode/index.d.ts' 파일을 열면 API 전체 집합을 열 수 있습니다.

## 테스트 실행

- [Extension Test Runner] 설치(https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner)
- **Tasks:RunTask** 명령을 통해 "Watch" 작업을 실행합니다. 이 작업이 실행 중인지 확인하거나 테스트가 검색되지 않을 수 있습니다.
- 활동 표시줄에서 Testing 보기를 열고 Run Test(테스트 실행) 버튼을 클릭하거나 'Ctrl/Cmd +; A' 키를 사용합니다
- Test Results(테스트 결과) 보기에서 테스트 결과의 출력을 참조하십시오.
- 'src/test/extension.test.ts'를 변경하거나 'test' 폴더 내에 새 테스트 파일을 만듭니다.
  - 제공되는 테스트 러너는 이름 패턴 '\*\*.test.ts'와 일치하는 파일만 고려합니다.
  - 'test' 폴더 내에 폴더를 만들어 원하는 방식으로 테스트를 구성할 수 있습니다.

## 더 나아가기

- [내선번호 묶음](https://code.visualstudio.com/api/working-with-extensions/bundling-extension) )을 통해 확장 크기를 줄이고 시작 시간을 개선합니다.
- [내선번호 공개하기](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) 를 VS코드 내선번호 마켓플레이스에 게시합니다.
- [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration) 을 설정하여 빌드를 자동화합니다.
