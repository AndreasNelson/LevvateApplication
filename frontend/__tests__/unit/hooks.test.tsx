import { renderHook, act } from '@testing-library/react';
import { useOnboarding } from '../../src/hooks/useOnboarding';
import { OnboardingProvider } from '../../src/context/OnboardingContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('useOnboarding', () => {
  it('should provide context values', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    
    expect(result.current.currentStep).toBeDefined();
    expect(result.current.stepsCompleted).toBeDefined();
    expect(result.current.submitStep).toBeDefined();
  });

  it('should throw when used outside provider', () => {
    // Suppress console errors for this test
    const spy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => renderHook(() => useOnboarding())).toThrow();
    
    spy.mockRestore();
  });
});
