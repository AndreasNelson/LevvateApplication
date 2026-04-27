import { render, screen, waitFor } from '@testing-library/react';
import App from '../../src/App';
import { MantineProvider } from '@mantine/core';
import { apiClient } from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient');

describe('App Component', () => {
  it('should render the app and initial route', async () => {
    (apiClient.createClient as jest.Mock).mockResolvedValue({
      uuid: 'test-uuid',
      progress: { currentStep: 1, stepsCompleted: [] }
    });

    (apiClient.getClient as jest.Mock).mockResolvedValue({
        client: { uuid: 'test-uuid', email: 'test@example.com' },
        progress: { currentStep: 1, stepsCompleted: [], isComplete: false },
        stepData: {}
    });

    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Levvate Onboarding/i)).toBeInTheDocument();
    });
  });
});
