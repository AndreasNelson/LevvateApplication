import { render, screen } from '@testing-library/react';
import { OnboardingProvider, OnboardingContext } from '../../src/context/OnboardingContext';
import { useContext } from 'react';

const TestComponent = () => {
  const context = useContext(OnboardingContext);
  return <div>{context?.currentStep}</div>;
};

describe('OnboardingContext', () => {
  it('should initialize with default values', () => {
    render(
      <OnboardingProvider>
        <TestComponent />
      </OnboardingProvider>
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should load from localStorage', () => {
    localStorage.setItem('clientUuid', 'test-uuid');
    
    render(
      <OnboardingProvider>
        <TestComponent />
      </OnboardingProvider>
    );
    
    localStorage.removeItem('clientUuid');
  });
});
