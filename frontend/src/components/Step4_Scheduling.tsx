import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit.js';
import { useOnboarding } from '../hooks/useOnboarding.js';
import { Button, Title, Text, Stack, Card, Alert, TextInput } from '@mantine/core';

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(formData);
    if (success) onNext();
  };

  // Get today's date as minimum
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card shadow="none" padding="0">
      <Title order={2} mb="xs">Schedule Initial Meeting</Title>
      <Text c="dimmed" mb="xl">Select a preferred date and time for our kick-off call.</Text>

      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput
            label="Preferred Date"
            type="date"
            required
            min={today}
            value={formData.meetingDate}
            onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
          />
          <TextInput
            label="Preferred Time"
            type="time"
            required
            value={formData.meetingTime}
            onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
          />
          
          {error && <Alert color="red" mt="md">{error}</Alert>}
          
          <Button type="submit" loading={submitting} size="md" mt="xl" fullWidth>
            Finalize Onboarding
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default Step4_Scheduling;
