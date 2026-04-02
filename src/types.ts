export type AlgorithmId = "bubble-sort" | "linear-search";

export type VisualizationKind = "bars" | "cards";

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
  visualization: VisualizationKind;
  initialValues: number[];
  targetValue?: number;
  complexity: string;
  steps: AlgorithmStep[];
};
