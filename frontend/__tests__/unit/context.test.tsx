import { renderHook, act } from '@testing-library/react';
import { OnboardingProvider } from '../../src/context/OnboardingContext';
import { useOnboarding } from '../../src/hooks/useOnboarding';
import { apiClient } from '../../src/services/apiClient';
import React from 'react';

jest.mock('../../src/services/apiClient');

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('OnboardingContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize and handle client initialization', async () => {
    (apiClient.getClient as jest.Mock).mockResolvedValue({
      progress: { currentStep: 2, stepsCompleted: [1], isComplete: false },
      stepData: { 1: { name: 'Test' } }
    });

    const { result } = renderHook(() => useOnboarding(), { wrapper });

    await act(async () => {
      await result.current.initializeClient('test-uuid');
    });

    expect(result.current.currentStep).toBe(2);
    expect(result.current.stepsCompleted).toEqual([1]);
    expect(result.current.stepData[1]).toEqual({ name: 'Test' });
  });

  it('should handle submitStep and errors', async () => {
    (apiClient.getClient as jest.Mock).mockResolvedValue({
        progress: { currentStep: 1, stepsCompleted: [], isComplete: false },
        stepData: {}
    });

    const { result } = renderHook(() => useOnboarding(), { wrapper });

    // Force clientUuid
    await act(async () => {
        result.current.setClientUuid('test-uuid');
    });

    (apiClient.submitStep as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'Submit failed' } }
    });

    await act(async () => {
      try {
        await result.current.submitStep(1, { name: 'Test' });
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.error).toBe('Submit failed');
  });

  it('should throw error if submitStep called without uuid', async () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });

    await expect(result.current.submitStep(1, {})).rejects.toThrow('No client UUID');
  });
});
