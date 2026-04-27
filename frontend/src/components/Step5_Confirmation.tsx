import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding.js';
import { Title, Text, Stack, Card, Alert, List, ThemeIcon, Code, Paper, Group, Divider, Box } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export const Step5_Confirmation: React.FC = () => {
  const { stepData, clientUuid } = useOnboarding();

  return (
    <Card shadow="none" padding="0">
      <Stack align="center" gap="xs" mb={40}>
        <ThemeIcon size={80} radius={80} color="green" variant="light">
          <IconCheck size={40} />
        </ThemeIcon>
        <Title order={1} c="green.8">Onboarding Complete!</Title>
        <Text c="dimmed" size="lg">Thank you for completing your onboarding with Levvate.</Text>
      </Stack>

      <Divider mb="xl" label="Summary of Submitted Information" labelPosition="center" />

      <Stack gap="xl">
        <Paper withBorder p="md" bg="gray.0">
          <Title order={4} mb="md">Submission Details</Title>
          <Stack gap="sm">
            {Object.entries(stepData).map(([step, data]) => (
              <Box key={step}>
                <Text size="xs" fw={700} c="dimmed" tt="uppercase">Step {step}</Text>
                <Code block color="blue.0" c="blue.9">
                  {JSON.stringify(data, null, 2)}
                </Code>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Alert color="blue" title="Save your tracking link" radius="md">
          <Text size="sm" mb="xs">
            Use your Tracking ID to return to your onboarding at any time:
          </Text>
          <Code block color="white" style={{ border: '1px solid #d0ebff' }}>
            {window.location.origin}/onboarding/{clientUuid}
          </Code>
        </Alert>

        <Paper withBorder p="lg" radius="md" bg="green.0">
          <Title order={4} c="green.9" mb="md">Automated Actions Triggered</Title>
          <List
            spacing="sm"
            size="sm"
            center
            icon={
              <ThemeIcon color="green" size={24} radius="xl">
                <IconCheck size={16} />
              </ThemeIcon>
            }
          >
            <List.Item>Client information synced to HubSpot CRM (Mocked)</List.Item>
            <List.Item>Internal team notified of completion via Slack (Mocked)</List.Item>
            <List.Item>Personalized confirmation email sent to your inbox (Mocked)</List.Item>
          </List>
        </Paper>
      </Stack>
    </Card>
  );
};

export default Step5_Confirmation;
