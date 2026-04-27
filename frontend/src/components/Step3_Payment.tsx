import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit.js';
import { useOnboarding } from '../hooks/useOnboarding.js';

interface Step3Data {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export const Step3_Payment: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { stepData } = useOnboarding();
  const { handleSubmit, submitting, error } = useFormSubmit(3);
  const [formData, setFormData] = useState<Step3Data>(
    (stepData[3] as Step3Data) || { cardNumber: '', expiryDate: '', cvc: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(formData);
    if (success) onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Card Number *</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="4242 4242 4242 4242"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Expiry Date *</label>
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">CVC *</label>
            <input
              type="text"
              name="cvc"
              placeholder="123"
              value={formData.cvc}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default Step3_Payment;
