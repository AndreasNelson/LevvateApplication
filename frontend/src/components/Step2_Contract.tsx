import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit.js';
import { useOnboarding } from '../hooks/useOnboarding.js';
import { Button, Title, Text, Stack, Card, Alert, Checkbox, ScrollArea, Paper } from '@mantine/core';

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
    const success = await handleSubmit(formData);
    if (success) onNext();
  };

  return (
    <Card shadow="none" padding="0">
      <Title order={2} mb="xs">Service Agreement</Title>
      <Text c="dimmed" mb="xl">Please review and accept our standard service terms.</Text>

      <Paper withBorder p="md" mb="xl" bg="gray.0">
        <Alert variant="light" color="blue" title="Demo Disclaimer" mb="md">
          This agreement is <b>non-binding</b> and generated for technical demonstration purposes only.
        </Alert>
        <ScrollArea h={200} offsetScrollbars>
          <Title order={4} mb="sm">Agreement Terms</Title>
          <Text size="sm" mb="md">
            <b>1. Services:</b> We agree to provide the services described in your proposal with professional care and skill.
          </Text>
          <Text size="sm" mb="md">
            <b>2. Payment:</b> Professional fees are as outlined in the proposal. Retainers are due prior to project commencement.
          </Text>
          <Text size="sm" mb="md">
            <b>3. Confidentiality:</b> Both parties agree to maintain the confidentiality of all proprietary information shared during the course of the project.
          </Text>
          <Text size="sm" mb="md">
            <b>4. Intellectual Property:</b> Upon final payment, the rights to the deliverables will transfer to the client, while we retain rights to our underlying methodologies.
          </Text>
          <Text size="sm">
            <b>5. Termination:</b> Either party may terminate this agreement with 30 days written notice. Fees for work completed up to that point will remain due.
          </Text>
        </ScrollArea>
      </Paper>

      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <Checkbox
            label="I have read and agree to the Service Agreement"
            checked={formData.agreedToTerms}
            onChange={(e) => setFormData({ agreedToTerms: e.currentTarget.checked })}
            required
          />
          
          {error && <Alert color="red" mt="md">{error}</Alert>}
          
          <Button 
            type="submit" 
            loading={submitting} 
            disabled={!formData.agreedToTerms}
            size="md" 
            mt="xl" 
            fullWidth
          >
            Next: Payment Method
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default Step2_Contract;
