import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../hooks/useOnboarding.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { Step1_ClientInfo } from '../components/Step1_ClientInfo.js';
import { Step2_Contract } from '../components/Step2_Contract.js';
import { Step3_Payment } from '../components/Step3_Payment.js';
import { Step4_Scheduling } from '../components/Step4_Scheduling.js';
import { Step5_Confirmation } from '../components/Step5_Confirmation.js';
import { apiClient } from '../services/apiClient.js';
import { Loader, Center, Box, Title, Text, Button, Alert, LoadingOverlay } from '@mantine/core';

export const OnboardingContainer: React.FC = () => {
  const { uuid } = useParams<{ uuid?: string }>();
  const navigate = useNavigate();
  const { 
    clientUuid, 
    currentStep, 
    stepsCompleted, 
    isComplete, 
    setClientUuid, 
    setCurrentStep,
    isInitializing,
    isGeneratingId,
    createInitialClient,
    error 
  } = useOnboarding();
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
    if (!uuid && !clientUuid && !isInitializing && !isGeneratingId) {
      startNewOnboarding();
    }
  }, [uuid, clientUuid, isInitializing, isGeneratingId]);

  const startNewOnboarding = async () => {
    try {
      setFormError(null);
      const newUuid = await createInitialClient();
      navigate(`/onboarding/${newUuid}`, { replace: true });
    } catch (err: any) {
      setFormError('Failed to start onboarding');
    }
  };

  if (isInitializing) {
    return (
      <Center py={50}>
        <Box style={{ textAlign: 'center' }}>
          <Loader size="xl" mb="md" />
          <Title order={3} mb="xs">Preparing your onboarding...</Title>
          <Text c="dimmed">Our demo server may take a few seconds to wake up. Thank you for your patience!</Text>
        </Box>
      </Center>
    );
  }

  if (error && !isGeneratingId) {
    return (
      <Box p="xl" style={{ textAlign: 'center' }}>
        <Title order={3} c="red" mb="md">Error</Title>
        <Text mb="xl">{error}</Text>
        <Button onClick={startNewOnboarding} color="blue">
          Start New Onboarding
        </Button>
      </Box>
    );
  }

  const handleNextStep = () => {
    // Component will update automatically via context
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay 
        visible={isGeneratingId} 
        zIndex={1000} 
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ size: 'md', variant: 'bars' }}
      />
      
      {isGeneratingId && (
          <Box pos="absolute" style={{ top: '60%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1001, textAlign: 'center' }}>
              <Text fw={500} size="lg">Generating your session...</Text>
              <Text size="xs" c="dimmed">This won't take long.</Text>
          </Box>
      )}

      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={5} 
        stepsCompleted={stepsCompleted} 
        onStepClick={handleStepClick}
      />
      
      {formError && (
        <Alert color="red" title="Error" mb="xl">
          {formError}
        </Alert>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 5 || isComplete ? (
            <Step5_Confirmation />
          ) : (
            <>
              {currentStep === 1 && <Step1_ClientInfo onNext={handleNextStep} />}
              {currentStep === 2 && <Step2_Contract onNext={handleNextStep} />}
              {currentStep === 3 && <Step3_Payment onNext={handleNextStep} />}
              {currentStep === 4 && <Step4_Scheduling onNext={handleNextStep} />}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default OnboardingContainer;
