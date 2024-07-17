export interface problemData {
  number: string;
  title: string;
  info: string | null;
  description: string;
  input: string | null;
  output: string | null;
  limit: string | null;
  testCaseInputs: string[] | null;
  testCaseOutputs: string[] | null;
  testCaseExplains: string[] | null;
  hint: string | null;
  source: string | null;
}
