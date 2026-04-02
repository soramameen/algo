export type AlgorithmId = "bubble-sort" | "linear-search";

export type StepAction = "compare" | "swap" | "inspect" | "found" | "settled";

export type AlgorithmStep = {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  matchedIndices: number[];
  action: StepAction;
  message: string;
};

export type AlgorithmSpec = {
  id: AlgorithmId;
  name: string;
  summary: string;
  description: string;
  initialValues: number[];
  targetValue?: number;
  steps: AlgorithmStep[];
};
