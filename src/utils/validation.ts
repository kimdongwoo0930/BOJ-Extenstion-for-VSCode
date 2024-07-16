export const ProblemNumberInputValidation = (inputText: any): boolean => {
  if (!inputText) {
    return false;
  }

  const numberRegex = /^\d+$/;
  if (!numberRegex.test(inputText)) {
    return false;
  }

  return true;
};
