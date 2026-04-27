import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit.js';
import { useOnboarding } from '../hooks/useOnboarding.js';
import { Button, Title, Text, Stack, Card, Alert, TextInput, Group } from '@mantine/core';

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(formData);
    if (success) onNext();
  };

  return (
    <Card shadow="none" padding="0">
      <Title order={2} mb="xs">Payment Method</Title>
      <Text c="dimmed" mb="xl">Securely set up your payment details for the project retainer.</Text>

      <Alert variant="outline" color="orange" title="Reminder" mb="xl">
        Use <b>4242</b> test card numbers. No actual charges will be made.
      </Alert>

      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput
            label="Card Number"
            placeholder="4242 4242 4242 4242"
            required
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
          />
          
          <Group grow>
            <TextInput
              label="Expiry Date"
              placeholder="MM/YY"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
            <TextInput
              label="CVC"
              placeholder="123"
              required
              value={formData.cvc}
              onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
            />
          </Group>
          
          {error && <Alert color="red" mt="md">{error}</Alert>}
          
          <Button type="submit" loading={submitting} size="md" mt="xl" fullWidth>
            Next: Scheduling
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default Step3_Payment;
