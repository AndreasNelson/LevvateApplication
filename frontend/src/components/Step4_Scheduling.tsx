import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit.js';
import { useOnboarding } from '../hooks/useOnboarding.js';

interface Step4Data {
  meetingDate: string;
  meetingTime: string;
}

export const Step4_Scheduling: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { stepData } = useOnboarding();
  const { handleSubmit, submitting, error } = useFormSubmit(4);
  const [formData, setFormData] = useState<Step4Data>(
    (stepData[4] as Step4Data) || { meetingDate: '', meetingTime: '' }
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

  // Get today's date as minimum
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Schedule Initial Meeting</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Preferred Date *</label>
          <input
            type="date"
            name="meetingDate"
            value={formData.meetingDate}
            onChange={handleChange}
            min={today}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Preferred Time *</label>
          <input
            type="time"
            name="meetingTime"
            value={formData.meetingTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Scheduling...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default Step4_Scheduling;
