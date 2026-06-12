import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { LanguageScreen } from "./components/LanguageScreen";
import { RoleScreen } from "./components/RoleScreen";
import { WorkerRegistration } from "./components/WorkerRegistration";
import { EmployerRegistration } from "./components/EmployerRegistration";
import { PaymentScreen } from "./components/PaymentScreen";
import { SearchScreen } from "./components/SearchScreen";

const AppContent: React.FC = () => {
  const { screen } = useApp();
  switch (screen) {
    case "language": return <LanguageScreen />;
    case "role": return <RoleScreen />;
    case "register-worker": return <WorkerRegistration />;
    case "register-employer": return <EmployerRegistration />;
    case "payment": return <PaymentScreen />;
    case "search": return <SearchScreen />;
    default: return <LanguageScreen />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <AppContent />
      </div>
    </AppProvider>
  );
}
