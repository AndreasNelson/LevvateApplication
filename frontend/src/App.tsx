import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext.js';
import { Layout } from './components/Layout.js';
import { OnboardingContainer } from './pages/OnboardingContainer.js';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <OnboardingProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<OnboardingContainer />} />
            <Route path="/onboarding/:uuid" element={<OnboardingContainer />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </Layout>
      </OnboardingProvider>
    </BrowserRouter>
  );
}

export default App;
