import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit.js';
import { useOnboarding } from '../hooks/useOnboarding.js';

interface Step1Data {
  name: string;
  email: string;
  company: string;
  phone: string;
}

export const Step1_ClientInfo: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { stepData } = useOnboarding();
  const { handleSubmit, submitting, error } = useFormSubmit(1);
  const [formData, setFormData] = useState<Step1Data>(
    (stepData[1] as Step1Data) || { name: '', email: '', company: '', phone: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return;
    }
    const success = await handleSubmit(formData);
    if (success) onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Client Information</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default Step1_ClientInfo;
