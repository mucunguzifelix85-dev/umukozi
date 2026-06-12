import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationForm } from './components/RegistrationForm';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';

const AppContent: React.FC = () => {
  const { activeScreen } = useApp();

  // Evaluate and render the appropriate visible view
  switch (activeScreen) {
    case 'welcome':
      return <WelcomeScreen />;
      
    case 'register-worker':
    case 'register-employer':
      return <RegistrationForm />;
      
    case 'app':
      return <Dashboard />;
      
    case 'admin':
      return <AdminPanel />;
      
    default:
      return <WelcomeScreen />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col justify-between" id="app-wrapper">
        <AppContent />
      </div>
    </AppProvider>
  );
}
