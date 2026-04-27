import React from 'react';
import { render, screen } from '@testing-library/react';
import { Layout } from '../../src/components/Layout';
import { MantineProvider } from '@mantine/core';

describe('Layout Component', () => {
  it('should render children and mockup warning', () => {
    render(
      <MantineProvider>
        <Layout>
          <div data-testid="test-child">Test Child</div>
        </Layout>
      </MantineProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText(/Mockup Application/i)).toBeInTheDocument();
    expect(screen.getByText(/Levvate Onboarding/i)).toBeInTheDocument();
  });
});
