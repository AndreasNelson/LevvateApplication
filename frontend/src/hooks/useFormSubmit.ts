import { useState, useCallback } from 'react';
import { useOnboarding } from './useOnboarding.js';
import { StepFormData } from '../types/index.js';

export const useFormSubmit = (step: number) => {
  const { submitStep } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (formData: StepFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      await submitStep(step, formData);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [step, submitStep]);

  return { handleSubmit, submitting, error };
};

export default useFormSubmit;
