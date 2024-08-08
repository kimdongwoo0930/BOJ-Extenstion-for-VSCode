import * as path from "path";
import * as vscode from "vscode";
import * as fs from "fs";
import * as util from "util";

export function getHtmlFilesInSameFolder(
  document: vscode.TextDocument
): string[] {
  const folderPath = path.dirname(document.fileName);
  //   console.log(`Searching for HTML files in folder: ${folderPath}`); // 디버깅용 로그
  const files = fs.readdirSync(folderPath);
  //   console.log(`Files in folder: ${files.join(", ")}`); // 디버깅용 로그
  return files
    .filter((file) => path.extname(file).toLowerCase() === ".html")
    .map((file) => path.join(folderPath, file));
}

const readFile = util.promisify(fs.readFile);

export async function getHtmlContent(filePath: string): Promise<string> {
  try {
    const absolutePath = path.resolve(filePath); // 절대 경로로 변환
    // console.log(
    //   `Attempting to read HTML file from absolute path: ${absolutePath}`
    // ); // 디버깅용 로그
    const htmlContent = await readFile(absolutePath, "utf8");
    return htmlContent;
  } catch (error) {
    vscode.window.showErrorMessage(`HTML을 가져오는데 실패했습니다.`);
    throw error;
  }
}
