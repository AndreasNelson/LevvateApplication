import { renderHook } from '@testing-library/react';
import { useOnboarding } from '../../src/hooks/useOnboarding';
import React from 'react';

describe('useOnboarding', () => {
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useOnboarding())).toThrow('useOnboarding must be used within OnboardingProvider');
    
    consoleSpy.mockRestore();
  });
});
