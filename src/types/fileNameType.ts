interface fileNameType {
    [key: string]: string;
}

const fileNameType: fileNameType = {
    c: 'main.c',
    cpp: 'main.cpp',
    py: 'app.py',
    java: 'Main.java',
    js: 'index.js',
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
