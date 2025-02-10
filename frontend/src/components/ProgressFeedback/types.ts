export interface ProgressFeedbackProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    title: string;
    completed: boolean;
    hasError?: boolean;
    hint?: string;
  }[];
  onStepClick?: (step: number) => void;
}

export interface StyleProps {
  completed: boolean;
  current: boolean;
  hasError?: boolean;
}
