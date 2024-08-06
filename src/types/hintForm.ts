import { problemData } from "./problemData";
export const getHintForm = ({
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

  return `    
  문제 ${number}번을 ${language} 언어로 해결하려고 합니다.

    설명: ${cleanDescription}
    입력: ${cleanInput}
    출력: ${cleanOutput}
    제약: ${cleanLimit}
    예제:
      입력: ${problemData.testCaseInputs!}
      출력: ${problemData.testCaseOutputs!}

    이 문제를 푸는 데 필요한 접근법이나 힌트만 주세요. 코드는 필요 없습니다.`;
};

interface QuestionParam {
  number: string; // 문제 번호
  problemData: problemData; // 문제 데이터
  language: string; // 해결 언어
}
