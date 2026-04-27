import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit.js';
import { useOnboarding } from '../hooks/useOnboarding.js';

interface Step2Data {
  agreedToTerms: boolean;
}

export const Step2_Contract: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { stepData } = useOnboarding();
  const { handleSubmit, submitting, error } = useFormSubmit(2);
  const [formData, setFormData] = useState<Step2Data>(
    (stepData[2] as Step2Data) || { agreedToTerms: false }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      return;
    }
    const success = await handleSubmit(formData);
    if (success) onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Service Agreement</h2>
      <div className="bg-gray-50 p-6 rounded-lg mb-6 max-h-64 overflow-y-auto">
        <h3 className="font-bold mb-2">Service Agreement Terms</h3>
        <p className="text-sm text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. By agreeing to these terms,
          you acknowledge that you have read, understood, and agree to be bound by this agreement.
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({ agreedToTerms: e.target.checked })}
              className="mr-3"
            />
            <span className="text-gray-700">I agree to the Service Agreement *</span>
          </label>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          disabled={submitting || !formData.agreedToTerms}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default Step2_Contract;
