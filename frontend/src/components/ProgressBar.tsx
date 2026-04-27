import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepsCompleted: number[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, stepsCompleted }) => {
  const stepLabels = ['Info', 'Contract', 'Payment', 'Schedule', 'Confirm'];

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${(stepsCompleted.length / totalSteps) * 100}%` }}
      />
      <div className="flex justify-between mt-4">
        {stepLabels.map((label, idx) => (
          <div key={idx} className="text-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                stepsCompleted.includes(idx + 1) ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}
            >
              {idx + 1}
            </div>
            <div className="text-xs">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
