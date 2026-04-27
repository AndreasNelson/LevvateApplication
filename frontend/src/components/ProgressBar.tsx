import React from 'react';
import { Stepper, Box } from '@mantine/core';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepsCompleted: number[];
  onStepClick: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, stepsCompleted, onStepClick }) => {
  const stepLabels = ['Client Info', 'Contract', 'Payment', 'Scheduling', 'Confirmation'];

  const handleStepClick = (stepIndex: number) => {
    const targetStep = stepIndex + 1;
    // Allow clicking on any step that is already completed or the current step
    if (stepsCompleted.includes(targetStep) || targetStep <= Math.max(...stepsCompleted, 0) + 1) {
      onStepClick(targetStep);
    }
  };

  return (
    <Box mb={40}>
      <Stepper 
        active={currentStep - 1} 
        onStepClick={handleStepClick}
        size="sm"
      >
        {stepLabels.map((label, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepsCompleted.includes(stepNumber);
          const isCurrent = stepNumber === currentStep;
          const isSelectable = isCompleted || stepNumber <= Math.max(...stepsCompleted, 0) + 1;

          return (
            <Stepper.Step 
              key={idx} 
              label={label} 
              description={isCurrent ? 'In Progress' : (isCompleted ? 'Completed' : 'Upcoming')}
              allowStepSelect={isSelectable}
            />
          );
        })}
      </Stepper>
    </Box>
  );
};

export default ProgressBar;
