# Develop Log

## Make Command

1. package.json 파일에 "command" 부분에 작성하기

```json
    "contributes": {
        "commands": [
        {
            "command": "boj-extension-for-vscode.helloWorld",
            "title": "Hello World"
        },
    ]
  },
```

2. extension.ts 파일에서 activate 함수 안에 해당 명령어를 입력했을때 실행할 코드 작성

```typescript
context.subscriptions.push(
  vscode.commands.registerCommand("boj-extension-for-vscode.helloworld", () => {
    // 실행될 함수
  })
);
```

3. package.json을 수정했다면 아래 명령어로 다시 컴파일 해준다

```bash
    npm run compile
```

4. 이후 디버그 모드를 통해 테스트 해보자.
