import * as vscode from "vscode";

export const getHint = (context: vscode.ExtensionContext) => {
  vscode.window.showInformationMessage("개발 중");
};
