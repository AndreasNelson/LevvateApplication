import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Levvate Onboarding</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;
