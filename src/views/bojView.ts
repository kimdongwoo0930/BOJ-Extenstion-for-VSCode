import * as vscode from "vscode";

type NodeKind = "section" | "action" | "info";

class BojNode extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly kind: NodeKind,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly description?: string,
  ) {
    super(label, collapsibleState);
    this.description = description;
    this.contextValue = kind;

    // 아이콘(있어보이게 만드는 핵심)
    if (kind === "section")
      this.iconPath = new vscode.ThemeIcon("symbol-folder");
    if (kind === "action") this.iconPath = new vscode.ThemeIcon("play");
    if (kind === "info") this.iconPath = new vscode.ThemeIcon("info");
  }
}

export class BojTreeProvider implements vscode.TreeDataProvider<BojNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem(element: BojNode): vscode.TreeItem {
    return element;
  }

  getChildren(element?: BojNode): vscode.ProviderResult<BojNode[]> {
    // 루트(섹션)
    if (!element) {
      return [
        new BojNode(
          "🚀 Quick Actions",
          "section",
          vscode.TreeItemCollapsibleState.Expanded,
        ),
        new BojNode(
          "📌 Current",
          "section",
          vscode.TreeItemCollapsibleState.Expanded,
        ),
        new BojNode(
          "🕘 Recent",
          "section",
          vscode.TreeItemCollapsibleState.Collapsed,
        ),
      ];
    }

    // 섹션별 자식
    if (element.label === "🚀 Quick Actions") {
      return [
        new BojNode(
          "문제 생성",
          "action",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "boj-extension-for-vscode.getProblemByNumber",
            title: "Create",
          },
          "번호 입력 → 폴더+파일",
        ),
        new BojNode(
          "문제 미리보기",
          "action",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "boj-extension-for-vscode.showProblemWithdoutFile",
            title: "Preview",
          },
          "파일 없이 보기",
        ),
        new BojNode(
          "테스트 실행",
          "action",
          vscode.TreeItemCollapsibleState.None,
          { command: "boj-extension-for-vscode.checkTestCase", title: "Test" },
          "예제 자동 채점",
        ),
        new BojNode(
          "현재 문제 다시 보기",
          "action",
          vscode.TreeItemCollapsibleState.None,
          { command: "boj-extension-for-vscode.showProblem", title: "Show" },
          "작업 중 문제",
        ),
      ];
    }

    if (element.label === "📌 Current") {
      // 나중에 상태 저장 붙이면 여기가 진짜 있어보임
      return [
        new BojNode(
          "현재 문제: (없음)",
          "info",
          vscode.TreeItemCollapsibleState.None,
          undefined,
          "문제 생성 후 자동 표시",
        ),
      ];
    }

    if (element.label === "🕘 Recent") {
      return [
        new BojNode(
          "최근 기록: 준비 중",
          "info",
          vscode.TreeItemCollapsibleState.None,
        ),
      ];
    }

    return [];
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}
