import * as vscode from 'vscode';
import { problemData } from '../types/problemData';

// 가져온 정보들을 백준 온라인 폼으로 보여주기위해 바꿔준다.
export const ProblemHtmlForm = (problemData: problemData) => {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <base href="https://www.acmicpc.net"> <!-- base url 설정 -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline'">
  <title>${problemData.title}</title>
  <link rel="stylesheet" href="https://ddo7jzca0m2vt.cloudfront.net/css/problem-font.css?version=20230101">
  <link rel="stylesheet" href="https://ddo7jzca0m2vt.cloudfront.net/unify/css/custom.css?version=20230101">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; margin: 0; }
    h1, h2, h3 { margin-top: 30px; }
    h1 { font-size: 28px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    ${getThemeStyles()}
    .problem-section { margin-bottom: 30px; }
    .problem-text p { margin: 0; }
    .problem-text a { color: #007bff; }
    .problem-io { margin-top: 20px; }
    .problem-io h3 { font-size: 20px; }
    .sample-container {
      display: flex;
      gap: 16px; /* 예제와 예제 사이의 간격 설정 (원하는 크기로 조정) */
    }
    .sample-box {
      flex: 1; /* 박스가 꽉 차도록 설정 */
    }
    .hidden {
      display: none;
    }
  </style>
  <script>
    function updateTheme() {
      const theme = ${JSON.stringify(createThemeMessage())};
      vscode.postMessage(theme);
    }            
    function getLocalResourceUri(resourcePath) {
      const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, resourcePath));
      const srcUri = panel.webview.asWebviewUri(onDiskPath);
      return srcUri;
    }
  </script>
  <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
      tex2jax: {inlineMath: [['$','$'], ['\$begin:math:text$','\\$end:math:text$']]}
    });
  </script>
  <script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
</head>
<body>
  <h1 style="display:inline">
    ${problemData.title}
  </h1>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <h3 style="display:inline">
  </h3>
  <br>
  <table>
    ${problemData.info}
  </table>
  <section id="description" class="problem-section">
    <div class="headline">
      <h2>문제</h2>
    </div>
    <div id="problem_description" class="problem-text">
      ${problemData.description}
    </div>
  </section>

  <section id="input" class="problem-section">
    <div class="headline">
      <h2>입력</h2>
    </div>
    <div id="problem_input" class="problem-text">
      ${problemData.input}
    </div>
  </section>

  <section id="output" class="problem-section">
    <div class="headline">
      <h2>출력</h2>
    </div>
    <div id="problem_output" class="problem-text">
      ${problemData.output}
    </div>
  </section>

  ${
      problemData.limit!.trim() !== ''
          ? `
    <section id="limit" class="problem-section">
      <div class="headline">
        <h2>제한</h2>
      </div>
      <div id="problem_limit" class="problem-text">
        ${problemData.limit}
      </div>
    </section>
    `
          : '<div id="limit" class="problem-section hidden"></div>'
  }

  <section id="sample-IOs" class="problem-section">
    ${problemData
        .testCaseInputs!.map(
            (input, index) => `
      <div class="sample-container">
        <div class="sample-box">
          <h2>예제 입력 ${index + 1}</h2>
          <pre class="sampledata">${input}</pre>
        </div>
        <div class="sample-box">
          <h2>예제 출력 ${index + 1}</h2>
          <pre class="sampledata">${problemData.testCaseOutputs![index]}</pre>
        </div>
      </div>
      ${problemData.testCaseExplains![index] === undefined ? '' : `${problemData.testCaseExplains![index]}`}
    `
        )
        .join('')}
  </section>

  ${
      problemData.hint!.trim() !== ''
          ? `
    <section id="hint" class="problem-section">
      <div class="headline">
        <h2>힌트</h2>
      </div>
      <div id="problem_hint" class="problem-text">
        ${problemData.hint}
      </div>
    </section>
    `
          : '<div id="hint" class="problem-section hidden"></div>'
  }

  ${
      problemData.source !== null
          ? `
    <section id="source" class="problem-section">
      <div id="source" class="problem-text">
        ${problemData.source}
      </div>
    </section>`
          : '<div id="source" class="problem-section hidden"></div>'
  }
</body>
</html>
`;
};

// 웹뷰에 전달할 테마 정보를 포함한 메시지를 생성하는 함수
function createThemeMessage() {
    const currentTheme = vscode.window.activeColorTheme.kind;
    return { theme: currentTheme };
}

function getThemeStyles() {
    // 현재 테마를 가져와서 해당 테마에 따른 스타일을 반환하는 함수
    const currentTheme = vscode.window.activeColorTheme.kind;
    switch (currentTheme) {
        case vscode.ColorThemeKind.Light:
            return `
        code { background-color: #f2f2f2; padding: 2px 4px; border-radius: 4px; }
        pre {
          background-color: #f2f2f2;
          color: black;
          font-size: 14px;
        }
      `;
        case vscode.ColorThemeKind.Dark:
            return `
        code { background-color: #2e2e2e; padding: 2px 4px; border-radius: 4px; }
        pre {
          background-color: #2e2e2e;
          color: white;
          font-size: 14px;
        }
      `;
        default:
            return '';
    }
}

/**
 * 주석 폼
 */
export const juseokForm = (lang: string, problemData: problemData, number: string): string => {
    const date = new Date().toISOString().split('T')[0];

    if (lang === 'py') {
        // python 시작 tool
        return `#=====================================================================
#   ${number}번: ${problemData.title}                   
#   @date:   ${date}              
#   @link:   https://www.acmicpc.net/problem/${number}  
#=====================================================================

inputs = input()


`;
    } else if (lang === 'cpp') {
        // c++ 시작 tool
        return `//=====================================================================
//   ${number}번: ${problemData.title}                   
//   @date:   ${date}              
//   @link:   https://www.acmicpc.net/problem/${number}  
//=====================================================================

#include <iostream>
using namespace std;
            
int main() {
              
  return 0;
}
`;
    } else if (lang === 'java') {
        // java 시작 tool
        return `//=====================================================================
//   ${number}번: ${problemData.title}                   
//   @date:   ${date}              
//   @link:   https://www.acmicpc.net/problem/${number}  
//=====================================================================

import java.util.Scanner;

public class Main {

  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
  }

}
`;
    } else if (lang === 'c') {
        // c 시작 tool
        return `//=====================================================================
//   ${number}번: ${problemData.title}                   
//   @date:   ${date}              
//   @link:   https://www.acmicpc.net/problem/${number}  
//=====================================================================

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
              
  return 0;
}
`;
    } else if (lang === 'js') {
        // javascript 시작 tool
        return `//=====================================================================
//   ${number}번: ${problemData.title}                   
//   @date:   ${date}              
//   @link:   https://www.acmicpc.net/problem/${number}  
//=====================================================================


const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  // 입력 처리
  rl.close();
});
`;
    } else {
        return '';
    }
};
