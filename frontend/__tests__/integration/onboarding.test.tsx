import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OnboardingProvider } from '../../src/context/OnboardingContext';
import { OnboardingContainer } from '../../src/pages/OnboardingContainer';
import { apiClient } from '../../src/services/apiClient';
import { MantineProvider } from '@mantine/core';
import React from 'react';

jest.mock('../../src/services/apiClient');

// Mock ScrollArea to avoid act warnings
jest.mock('@mantine/core', () => {
    const original = jest.requireActual('@mantine/core');
    return {
        ...original,
        ScrollArea: ({ children }: any) => <div>{children}</div>,
    };
});

const renderOnboarding = (initialPath = '/onboarding') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MantineProvider>
        <OnboardingProvider>
          <Routes>
            <Route path="/onboarding" element={<OnboardingContainer />} />
            <Route path="/onboarding/:uuid" element={<OnboardingContainer />} />
          </Routes>
        </OnboardingProvider>
      </MantineProvider>
    </MemoryRouter>
  );
};

describe('Onboarding Flow Comprehensive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should complete full flow and allow back navigation', async () => {
    const user = userEvent.setup({ delay: null });
    const uuid = 'test-uuid';

    (apiClient.createClient as jest.Mock).mockResolvedValue({
      uuid,
      progress: { currentStep: 1, stepsCompleted: [] }
    });

    (apiClient.submitStep as jest.Mock).mockImplementation((u, step, data) => {
      return Promise.resolve({
        progress: { 
          currentStep: step + 1, 
          stepsCompleted: Array.from({length: step}, (_, i) => i + 1),
          isComplete: step === 4
        }
      });
    });

    (apiClient.getClient as jest.Mock).mockResolvedValue({
        client: { uuid, email: 'test@example.com' },
        progress: { currentStep: 1, stepsCompleted: [], isComplete: false },
        stepData: {}
    });

    await act(async () => {
        renderOnboarding();
    });

    // Step 1
    await waitFor(() => expect(screen.getByRole('heading', { name: /Client Information/i })).toBeInTheDocument());
    await act(async () => {
        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
        await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
        await user.click(screen.getByRole('button', { name: /Next: Review Contract/i }));
    });

    // Step 2
    await waitFor(() => expect(screen.getByRole('heading', { name: /Service Agreement/i })).toBeInTheDocument());
    
    // Back navigation test - Click the stepper label to trigger onStepClick logic
    const step1Labels = screen.getAllByText('Client Info');
    await act(async () => {
        await user.click(step1Labels[0]);
    });
    await waitFor(() => expect(screen.getByRole('heading', { name: /Client Information/i })).toBeInTheDocument());
    await act(async () => {
        await user.click(screen.getByRole('button', { name: /Next: Review Contract/i }));
    });

    // Step 2 - Proceed
    await waitFor(() => expect(screen.getByRole('heading', { name: /Service Agreement/i })).toBeInTheDocument());
    await act(async () => {
        await user.click(screen.getByLabelText(/I have read and agree/i));
        await user.click(screen.getByRole('button', { name: /Next: Payment Method/i }));
    });

    // Step 3
    await waitFor(() => expect(screen.getByRole('heading', { name: /Payment Method/i })).toBeInTheDocument());
    await act(async () => {
        await user.type(screen.getByLabelText(/Card Number/i), '4242424242424242');
        await user.type(screen.getByLabelText(/Expiry Date/i), '12/26');
        await user.type(screen.getByLabelText(/CVC/i), '123');
        await user.click(screen.getByRole('button', { name: /Next: Scheduling/i }));
    });

    // Step 4
    await waitFor(() => expect(screen.getByRole('heading', { name: /Schedule Initial Meeting/i })).toBeInTheDocument());
    await act(async () => {
        await user.type(screen.getByLabelText(/Preferred Date/i), '2026-05-01');
        await user.type(screen.getByLabelText(/Preferred Time/i), '10:00');
        await user.click(screen.getByRole('button', { name: /Finalize Onboarding/i }));
    });

    // Step 5 (Confirmation)
    await waitFor(() => expect(screen.getByRole('heading', { name: /Review & Confirmation/i })).toBeInTheDocument());
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/4242/)).toBeInTheDocument();
  });

  it('should handle errors gracefully', async () => {
    const user = userEvent.setup({ delay: null });
    const uuid = 'error-uuid';

    // Mock generic error with no backend message
    (apiClient.getClient as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await act(async () => {
        renderOnboarding(`/onboarding/${uuid}`);
    });

    await waitFor(() => expect(screen.getByText(/Failed to load onboarding data/i)).toBeInTheDocument());
    
    // Test Start New Onboarding button in error state
    (apiClient.createClient as jest.Mock).mockResolvedValue({ uuid: 'new-uuid', progress: { currentStep: 1, stepsCompleted: [] } });
    await act(async () => {
        await user.click(screen.getByRole('button', { name: /Start New Onboarding/i }));
    });
    await waitFor(() => expect(screen.getByRole('heading', { name: /Client Information/i })).toBeInTheDocument());
  });

  it('should handle submission errors with backend message', async () => {
    const user = userEvent.setup({ delay: null });
    const uuid = 'test-uuid';

    (apiClient.getClient as jest.Mock).mockResolvedValue({
        client: { uuid, email: 'test@example.com' },
        progress: { currentStep: 1, stepsCompleted: [], isComplete: false },
        stepData: {}
    });
    localStorage.setItem('clientUuid', uuid);

    await act(async () => {
        renderOnboarding(`/onboarding/${uuid}`);
    });

    await waitFor(() => expect(screen.getByRole('heading', { name: /Client Information/i })).toBeInTheDocument());
    
    (apiClient.submitStep as jest.Mock).mockRejectedValueOnce({
        response: { data: { error: 'Validation Failed' } }
    });

    await act(async () => {
        await user.type(screen.getByLabelText(/Full Name/i), 'John');
        await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
        await user.click(screen.getByRole('button', { name: /Next/i }));
    });

    await waitFor(() => expect(screen.getByText(/Validation Failed/i)).toBeInTheDocument());
  });

  it('should handle submission errors without backend message', async () => {
    const user = userEvent.setup({ delay: null });
    const uuid = 'test-uuid';

    (apiClient.getClient as jest.Mock).mockResolvedValue({
        client: { uuid, email: 'test@example.com' },
        progress: { currentStep: 1, stepsCompleted: [], isComplete: false },
        stepData: {}
    });
    localStorage.setItem('clientUuid', uuid);

    await act(async () => {
        renderOnboarding(`/onboarding/${uuid}`);
    });

    await waitFor(() => expect(screen.getByRole('heading', { name: /Client Information/i })).toBeInTheDocument());
    
    (apiClient.submitStep as jest.Mock).mockRejectedValueOnce(new Error('Network Failure'));

    await act(async () => {
        await user.type(screen.getByLabelText(/Full Name/i), 'John');
        await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
        await user.click(screen.getByRole('button', { name: /Next/i }));
    });

    await waitFor(() => expect(screen.getByText(/Failed to submit step/i)).toBeInTheDocument());
  });

  it('should handle partial data in confirmation page', async () => {
    const uuid = 'partial-uuid';
    (apiClient.getClient as jest.Mock).mockResolvedValue({
        client: { uuid, email: 'test@example.com' },
        progress: { currentStep: 5, stepsCompleted: [1,2,3,4], isComplete: true },
        stepData: {
            1: { email: 'test@example.com' }, // missing name/company/phone
            2: { agreedToTerms: false },
            3: {}, // missing cardNumber
            4: {} // missing date/time
        }
    });
    localStorage.setItem('clientUuid', uuid);

    await act(async () => {
        renderOnboarding(`/onboarding/${uuid}`);
    });

    await waitFor(() => expect(screen.getByRole('heading', { name: /Review & Confirmation/i })).toBeInTheDocument());
    expect(screen.getAllByText(/Not provided/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Not scheduled/i).length).toBeGreaterThan(0);
  });
});
