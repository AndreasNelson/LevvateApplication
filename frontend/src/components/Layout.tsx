import React, { ReactNode } from 'react';
import { AppShell, Header, Container, Alert, Text, Title, Group, Box } from '@mantine/core';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
          minHeight: '100vh',
        },
      })}
    >
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Title order={2} c="blue.7">Levvate Onboarding</Title>
            <Text size="sm" c="dimmed" fs="italic">Technical Demonstration</Text>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="md" pt="xl">
          <Alert color="red" title="Mockup Application" mb="xl" radius="md" variant="light">
            This site is a <b>demo mockup</b>. Please do <b>not</b> enter any real personal information or actual credit card details. All data is for demonstration purposes only.
          </Alert>
          <Box bg="white" p="xl" style={{ borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
            {children}
          </Box>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
