import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../hooks/useOnboarding.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { Step1_ClientInfo } from '../components/Step1_ClientInfo.js';
import { Step2_Contract } from '../components/Step2_Contract.js';
import { Step3_Payment } from '../components/Step3_Payment.js';
import { Step4_Scheduling } from '../components/Step4_Scheduling.js';
import { Step5_Confirmation } from '../components/Step5_Confirmation.js';
import apiClient from '../services/apiClient.js';

export const OnboardingContainer: React.FC = () => {
  const { uuid } = useParams<{ uuid?: string }>();
  const navigate = useNavigate();
  const { clientUuid, currentStep, stepsCompleted, isComplete, setClientUuid, loading, error } = useOnboarding();
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize client from URL if UUID provided
  useEffect(() => {
    if (uuid && !clientUuid) {
      setClientUuid(uuid);
      localStorage.setItem('clientUuid', uuid);
    }
  }, [uuid, clientUuid, setClientUuid]);

  // Redirect to new onboarding if no UUID
  useEffect(() => {
    if (!uuid && !clientUuid && !loading) {
      startNewOnboarding();
    }
  }, [uuid, clientUuid, loading]);

  const startNewOnboarding = async () => {
    try {
      setFormError(null);
      const response = await apiClient.createClient('temp@example.com');
      setClientUuid(response.uuid);
      localStorage.setItem('clientUuid', response.uuid);
      navigate(`/onboarding/${response.uuid}`, { replace: true });
    } catch (err: any) {
      setFormError('Failed to start onboarding');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Preparing your onboarding...</h2>
        <p className="text-gray-600">Our demo server may take a few seconds to wake up. Thank you for your patience!</p>
        <div className="mt-8 space-y-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6 mx-auto"></div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-lg shadow border border-red-200">
        <p className="text-red-800">{error}</p>
        <button
          onClick={startNewOnboarding}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start New Onboarding
        </button>
      </div>
    );
  }

  if (isComplete || currentStep > 5) {
    return (
      <div>
        <ProgressBar currentStep={5} totalSteps={5} stepsCompleted={stepsCompleted} />
        <Step5_Confirmation />
      </div>
    );
  }

  const handleNextStep = () => {
    // Component will update automatically via context
  };

  return (
    <div>
      <ProgressBar currentStep={currentStep} totalSteps={5} stepsCompleted={stepsCompleted} />
      
      {formError && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
          <p className="text-red-800">{formError}</p>
        </div>
      )}

      {currentStep === 1 && <Step1_ClientInfo onNext={handleNextStep} />}
      {currentStep === 2 && <Step2_Contract onNext={handleNextStep} />}
      {currentStep === 3 && <Step3_Payment onNext={handleNextStep} />}
      {currentStep === 4 && <Step4_Scheduling onNext={handleNextStep} />}
    </div>
  );
};

export default OnboardingContainer;
