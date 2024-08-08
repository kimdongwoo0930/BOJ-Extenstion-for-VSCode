import { InputForm } from "./../utils/makeForm";
import { problemData } from "./problemData";

/**
 * @title GPT 질문 폼 제작 함수
 * @param number 문제 번호
 * @param problemData 문제 데이터
 * @param language 사용 언어
 * @returns 솔루션 form
 */
export const getSolutionForm = ({
  number,
  problemData,
  language,
}: QuestionParam) => {
  const cleanDescription = problemData.description.replace(/<[^>]+>/g, " "); // HTML 태그 제거
  const cleanLimit = problemData.limit
    ? problemData.limit.replace(/<[^>]+>/g, " ")
    : "";

  const cleanInput = problemData.input?.replace(/<[^>]+>/g, " ");
  const cleanOutput = problemData.output?.replace(/<[^>]+>/g, " ");

  const inputForm = InputForm(language);
  const url = `https://www.acmicpc.net/problem/${number}`;

  const testCaseDetails = problemData
    .testCaseInputs!.map((input, index) => {
      const explain = problemData.testCaseExplains
        ? problemData.testCaseExplains[index]
        : "";
      const output = problemData.testCaseOutputs
        ? problemData.testCaseOutputs[index]
        : "";
      return `
      테스트 케이스 ${index + 1}:
      입력: ${input}
      출력: ${output}
      설명: ${explain}
    `;
    })
    .join("\n"); //

  return `

  url : ${url}
  문제 ${number}번을 ${language} 언어로 해설을해주세요.

    설명: ${cleanDescription}
    입력: ${cleanInput}
    출력: ${cleanOutput}
    제약: ${cleanLimit}
    예제: ${testCaseDetails}
    
    전체 코드를 제공하는 대신, 문제 해결을 위한 핵심 알고리즘 부분만 제공해 주세요. 코드를 어떻게 작성할지에 대한 설명과 함께, 필요한 부분의 알고리즘을 설명해 주시면 좋겠습니다.

    특히, 다음 사항을 포함해 주세요:
        1. 문제를 해결하기 위한 알고리즘 설명
        2. 코드를 작성하는 방법 및 논리
        3. 코드의 각 부분에 대한 설명
    
    `;
};

interface QuestionParam {
  number: string; // 문제 번호
  problemData: problemData; // 문제 데이터
  language: string; // 해결 언어
}

// =================================================================
/**
 * @title 마크다운 작성 폼
 * @param number 문제 번호
 * @param lang 사용언어
 * @param content gpt 응답 내용
 * @returns form
 */
export const markdownForm = (number: string, lang: string, content: string) => {
  return `
# 🧩 솔루션

## 문제 URL
[문제 링크](https://www.acmicpc.net/problem/${number})

## 언어
${lang}

## 해설 
${content}

---

**경고:** 위 코드는 참고용으로만 제공되며, 실제로 정상적으로 작동하지 않을 수 있습니다. 코드 실행 전에 충분한 검토와 테스트를 권장합니다. 예상치 못한 오류나 문제 발생 시, 코드 수정이 필요할 수 있습니다.

*This solution is powered by GPT.4o-mini*`;
};
