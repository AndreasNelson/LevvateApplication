import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding.js';
import { Title, Text, Stack, Card, Alert, ThemeIcon, Paper, Divider, Box, SimpleGrid, Badge, Group } from '@mantine/core';
import { IconCheck, IconUser, IconFileText, IconCreditCard, IconCalendarTime } from '@tabler/icons-react';

export const Step5_Confirmation: React.FC = () => {
  const { stepData, clientUuid } = useOnboarding();

  // Helper to extract data safely
  const clientInfo = (stepData[1] as any) || {};
  const contractInfo = (stepData[2] as any) || {};
  const paymentInfo = (stepData[3] as any) || {};
  const scheduleInfo = (stepData[4] as any) || {};

  return (
    <Card shadow="none" padding="0">
      <Stack align="center" gap="xs" mb={30}>
        <ThemeIcon size={60} radius={60} color="green" variant="light">
          <IconCheck size={32} />
        </ThemeIcon>
        <Title order={2} c="green.8">Review & Confirmation</Title>
        <Text c="dimmed" size="md" ta="center">Please review your submitted information below.</Text>
      </Stack>

      <Divider mb="xl" label="Submission Summary" labelPosition="center" />

      <Stack gap="md">
        {/* Step 1: Client Info */}
        <Paper withBorder p="md" radius="md">
          <Group mb="xs">
            <IconUser size={20} color="#228be6" />
            <Title order={4}>Client Information</Title>
          </Group>
          <SimpleGrid cols={2} spacing="xs">
            <Box>
              <Text size="xs" fw={700} c="dimmed">NAME</Text>
              <Text size="sm">{clientInfo.name || 'Not provided'}</Text>
            </Box>
            <Box>
              <Text size="xs" fw={700} c="dimmed">EMAIL</Text>
              <Text size="sm">{clientInfo.email || 'Not provided'}</Text>
            </Box>
            <Box>
              <Text size="xs" fw={700} c="dimmed">COMPANY</Text>
              <Text size="sm">{clientInfo.company || 'Not provided'}</Text>
            </Box>
            <Box>
              <Text size="xs" fw={700} c="dimmed">PHONE</Text>
              <Text size="sm">{clientInfo.phone || 'Not provided'}</Text>
            </Box>
          </SimpleGrid>
        </Paper>

        {/* Step 2: Contract */}
        <Paper withBorder p="md" radius="md">
          <Group mb="xs">
            <IconFileText size={20} color="#228be6" />
            <Title order={4}>Service Agreement</Title>
          </Group>
          <Badge color={contractInfo.agreedToTerms ? 'green' : 'red'} variant="light">
            {contractInfo.agreedToTerms ? 'Terms Accepted' : 'Not Accepted'}
          </Badge>
          <Text size="xs" c="dimmed" mt="xs" style={{ fontStyle: 'italic' }}>Non-binding mock-up agreement</Text>
        </Paper>

        {/* Step 3: Payment */}
        <Paper withBorder p="md" radius="md">
          <Group mb="xs">
            <IconCreditCard size={20} color="#228be6" />
            <Title order={4}>Payment Method</Title>
          </Group>
          <Box>
            <Text size="xs" fw={700} c="dimmed">CARD ENDING IN</Text>
            <Text size="sm">•••• {paymentInfo.cardNumber?.slice(-4) || '****'}</Text>
          </Box>
        </Paper>

        {/* Step 4: Schedule */}
        <Paper withBorder p="md" radius="md">
          <Group mb="xs">
            <IconCalendarTime size={20} color="#228be6" />
            <Title order={4}>Scheduled Meeting</Title>
          </Group>
          <SimpleGrid cols={2} spacing="xs">
            <Box>
              <Text size="xs" fw={700} c="dimmed">DATE</Text>
              <Text size="sm">{scheduleInfo.meetingDate || 'Not scheduled'}</Text>
            </Box>
            <Box>
              <Text size="xs" fw={700} c="dimmed">TIME</Text>
              <Text size="sm">{scheduleInfo.meetingTime || 'Not scheduled'}</Text>
            </Box>
          </SimpleGrid>
        </Paper>

        <Alert color="blue" title="Tracking ID" radius="md" mt="lg">
          <Text size="xs">
            Your unique session ID for this demo: <b>{clientUuid}</b>
          </Text>
        </Alert>

        <Paper withBorder p="lg" radius="md" bg="green.0" mt="md">
          <Title order={5} c="green.9" mb="sm">Success!</Title>
          <Text size="sm" c="green.9">
            Your onboarding is complete. In a real-world scenario, your data would now be synced to 
            HubSpot, the team would be alerted via Slack or email, and you would receive a confirmation email.
          </Text>
        </Paper>
      </Stack>
    </Card>
  );
};

export default Step5_Confirmation;
