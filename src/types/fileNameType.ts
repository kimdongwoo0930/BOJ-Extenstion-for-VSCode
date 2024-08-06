interface fileNameType {
  [key: string]: string;
}

const fileNameType: fileNameType = {
  c: "main.c",
  cpp: "main.cpp",
  py: "app.py",
  java: "Main.java",
  js: "index.js",
};

/**
 * @Title 언어에 따른 파일 이름 반환 함수
 * @param language
 * @returns fileName
 * @method Getter
 */
export const getFileName = (language: string): string => {
  const fileName = fileNameType[language.toLowerCase()];
  if (!fileName) {
    throw new Error(`Unsupported language: ${language}`);
  }
  return fileName;
};

/**
 * @title 확장자에 따른 언어 명 반환 함수
 * @param lang 확장자 명
 * @returns 언어명
 */
export const getLangName = (lang: string) => {
  switch (lang) {
    case "py":
      return "Python";
    case "c":
      return "C";
    case "cpp":
      return "C++";
    case "js":
      return "JavaScript";
    case "java":
      return "Java";
    default:
      return "Unknown";
  }
};
