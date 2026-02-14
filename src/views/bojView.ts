import * as vscode from "vscode";

class BojNode extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly description?: string,
    public readonly iconName?: string,
  ) {
    super(label, collapsibleState);
    this.description = description;
    this.contextValue = "action";

    // 아이콘 설정
    if (iconName) {
      this.iconPath = new vscode.ThemeIcon(iconName);
    }
  }
}

export class BojTreeProvider implements vscode.TreeDataProvider<BojNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem(element: BojNode): vscode.TreeItem {
    return element;
  }

  getChildren(element?: BojNode): vscode.ProviderResult<BojNode[]> {
    // 루트에 바로 액션들 표시
    if (!element) {
      return [
        new BojNode(
          "문제 생성",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "boj-extension-for-vscode.getProblemByNumber",
            title: "Create",
          },
          "번호 입력 → 폴더+파일",
          "add",
        ),
        new BojNode(
          "문제 미리보기",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "boj-extension-for-vscode.showProblemWithdoutFile",
            title: "Preview",
          },
          "파일 없이 보기",
          "eye",
        ),
        new BojNode(
          "테스트 실행",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "boj-extension-for-vscode.checkTestCase",
            title: "Test",
          },
          "예제 자동 채점",
          "beaker",
        ),
        new BojNode(
          "현재 문제 다시 보기",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "boj-extension-for-vscode.showProblem",
            title: "Show",
          },
          "작업 중인 문제",
          "file",
        ),
      ];
    }

    return [];
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}
