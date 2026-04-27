export interface ClientData {
  uuid: string;
  email: string;
  name: string;
  company: string;
  phone: string;
}

export interface OnboardingProgress {
  currentStep: number;
  stepsCompleted: number[];
  isComplete: boolean;
}

export interface StepFormData {
  [key: string]: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
