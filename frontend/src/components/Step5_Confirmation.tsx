import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding.js';

export const Step5_Confirmation: React.FC = () => {
  const { stepData, clientUuid } = useOnboarding();

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">Onboarding Complete!</h2>
        <p className="text-gray-600">Thank you for completing your onboarding with Levvate.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-bold text-lg mb-4">Submitted Information</h3>
        <div className="space-y-3">
          {Object.entries(stepData).map(([step, data]) => (
            <div key={step} className="border-b pb-2">
              <p className="text-sm text-gray-600">Step {step}</p>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Your tracking ID:</strong> {clientUuid}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Use this ID to return to your onboarding anytime: 
          {' '}{window.location.origin}/onboarding/{clientUuid}
        </p>
      </div>

      <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-green-800">
          ✓ Client information submitted to HubSpot CRM
        </p>
        <p className="text-green-800">
          ✓ Team has been notified of your onboarding
        </p>
        <p className="text-green-800">
          ✓ Confirmation email sent
        </p>
      </div>
    </div>
  );
};

export default Step5_Confirmation;
