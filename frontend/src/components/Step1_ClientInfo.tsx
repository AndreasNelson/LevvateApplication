import React, { useState } from 'react';
import { useFormSubmit } from '../hooks/useFormSubmit.js';
import { useOnboarding } from '../hooks/useOnboarding.js';
import { TextInput, Button, Title, Text, Stack, Card, Alert } from '@mantine/core';

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return;
    }
    const success = await handleSubmit(formData);
    if (success) onNext();
  };

  return (
    <Card shadow="none" padding="0">
      <Title order={2} mb="xs">Client Information</Title>
      <Text c="dimmed" mb="xl">Please provide your basic contact details to get started.</Text>

      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextInput
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextInput
            label="Company Name"
            placeholder="Acme Inc."
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <TextInput
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          
          {error && <Alert color="red" mt="md">{error}</Alert>}
          
          <Button type="submit" loading={submitting} size="md" mt="xl" fullWidth>
            Next: Review Contract
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default Step1_ClientInfo;
