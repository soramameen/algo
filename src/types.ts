export type AlgorithmId = "bubble-sort" | "linear-search" | "array";

export type VisualizationType = "bars" | "cards" | "cells";

export type StepAction =
  | "compare"
  | "swap"
  | "inspect"
  | "found"
  | "settled"
  | "access"
  | "insert"
  | "delete";

export type AlgorithmStep = {
  values: number[];
  slots?: Array<number | null>;
  activeIndices: number[];
  sortedIndices: number[];
  matchedIndices: number[];
  shiftedIndices?: number[];
  writtenIndices?: number[];
  action: StepAction;
  message: string;
  complexity?: string;
};

export type AlgorithmSpec = {
  id: AlgorithmId;
  visualization: VisualizationType;
  name: string;
  summary: string;
  description: string;
  initialValues: number[];
  targetValue?: number;
  complexity: string;
  steps: AlgorithmStep[];
};
