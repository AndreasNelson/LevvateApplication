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
        allowStepSelect={true}
        size="sm"
      >
        {stepLabels.map((label, idx) => (
          <Stepper.Step 
            key={idx} 
            label={label} 
            description={idx + 1 === currentStep ? 'In Progress' : (stepsCompleted.includes(idx + 1) ? 'Completed' : 'Upcoming')}
            disabled={!stepsCompleted.includes(idx + 1) && idx + 1 !== currentStep && idx + 1 > Math.max(...stepsCompleted, 0) + 1}
          />
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressBar;
