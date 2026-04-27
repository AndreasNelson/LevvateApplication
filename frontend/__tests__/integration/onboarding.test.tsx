import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { OnboardingProvider } from '../../src/context/OnboardingContext';
import { OnboardingContainer } from '../../src/pages/OnboardingContainer';
import apiClient from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient');

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <OnboardingProvider>
        <OnboardingContainer />
      </OnboardingProvider>
    </BrowserRouter>
  );
};

describe('Onboarding Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render step 1 initially', async () => {
    (apiClient.createClient as jest.Mock).mockResolvedValueOnce({
      uuid: 'test-uuid',
      progress: { currentStep: 1, stepsCompleted: [] }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Client Information')).toBeInTheDocument();
    });
  });

  it('should handle onboarding initialization', async () => {
    (apiClient.createClient as jest.Mock).mockResolvedValueOnce({
      uuid: 'test-uuid',
      progress: { currentStep: 1, stepsCompleted: [] }
    });

    renderComponent();

    await waitFor(() => {
      expect(apiClient.createClient).toHaveBeenCalled();
    });
  });
});
