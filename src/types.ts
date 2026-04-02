export type AlgorithmId = "bubble-sort";

export type StepAction = "compare" | "swap" | "settled";

export type AlgorithmStep = {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  action: StepAction;
  message: string;
};

export type AlgorithmSpec = {
  id: AlgorithmId;
  name: string;
  summary: string;
  description: string;
  initialValues: number[];
  steps: AlgorithmStep[];
};
