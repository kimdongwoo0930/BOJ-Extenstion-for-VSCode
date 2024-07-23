import * as vscode from 'vscode';
import { problemData } from '../types/problemData';
import { ProblemHtmlForm } from '../utils/makeForm';

/**
 * @TItle 문제 문서 보여주기
 * @description 해당 문제를 가져와 웹뷰를 통해 전체적인 문제를 보여주기위한 함수이다.
 * @param context vscode.ExtensionContext
 */
export const showProblem = (number: string, problemData: problemData | void, context: vscode.ExtensionContext) => {
    const title = `${number}번: ${problemData!.title}`;

    // 웹뷰 생성
    const panel = vscode.window.createWebviewPanel('problemPreview', `${title}`, vscode.ViewColumn.Two, {
        enableScripts: true,
    });

    // 웹뷰에 백준 온라인 저지 스타일과 문제 데이터 출력
    panel.webview.html = ProblemHtmlForm(problemData!);
};

/**
 *
 * 참고 : https://github.com/dltkdgns00/BOJ-extension/blob/main/src/commands/showProblem.ts
 */
