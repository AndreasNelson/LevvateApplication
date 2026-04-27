import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { OnboardingProgress, StepFormData } from '../types/index.js';
import { apiClient } from '../services/apiClient.js';

interface OnboardingContextType {
  clientUuid: string | null;
  currentStep: number;
  stepsCompleted: number[];
  isComplete: boolean;
  stepData: Record<number, StepFormData>;
  loading: boolean;
  error: string | null;
  initializeClient: (uuid: string) => Promise<void>;
  submitStep: (step: number, formData: StepFormData) => Promise<void>;
  setClientUuid: (uuid: string) => void;
  setCurrentStep: (step: number) => void;
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [clientUuid, setClientUuid] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [stepData, setStepData] = useState<Record<number, StepFormData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedUuid = localStorage.getItem('clientUuid');
    if (savedUuid) {
      setClientUuid(savedUuid);
    }
  }, []);

  // Load client data when UUID changes
  useEffect(() => {
    if (clientUuid) {
      initializeClient(clientUuid);
    }
  }, [clientUuid]);

  const initializeClient = useCallback(async (uuid: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getClient(uuid);
      setCurrentStep(data.progress.currentStep);
      setStepsCompleted(data.progress.stepsCompleted);
      setIsComplete(data.progress.isComplete);
      setStepData(data.stepData || {});
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load onboarding data');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitStep = useCallback(async (step: number, formData: StepFormData) => {
    if (!clientUuid) throw new Error('No client UUID');

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.submitStep(clientUuid, step, formData);
      setCurrentStep(response.progress.currentStep);
      setStepsCompleted(response.progress.stepsCompleted);
      setIsComplete(response.progress.isComplete);
      setStepData(prev => ({ ...prev, [step]: formData }));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit step');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clientUuid]);

  return (
    <OnboardingContext.Provider
      value={{
        clientUuid,
        currentStep,
        stepsCompleted,
        isComplete,
        stepData,
        loading,
        error,
        initializeClient,
        submitStep,
        setClientUuid,
        setCurrentStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingContext;
