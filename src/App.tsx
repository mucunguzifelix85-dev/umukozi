import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { LanguageScreen } from "./components/LanguageScreen";
import { RoleScreen } from "./components/RoleScreen";
import { LocationScreen } from "./components/LocationScreen";
import { WorkerRegistration } from "./components/WorkerRegistration";
import { EmployerRegistration } from "./components/EmployerRegistration";
import { PaymentScreen } from "./components/PaymentScreen";
import { SearchScreen } from "./components/SearchScreen";

const AppContent: React.FC = () => {
  const { screen } = useApp();

  switch (screen) {
    case "language": return <LanguageScreen />;
    case "role": return <RoleScreen />;
    case "location-worker": return <LocationScreen />;
    case "register-worker": return <WorkerRegistration />;
    case "register-employer": return <EmployerRegistration />;
    case "payment": return <PaymentScreen />;
    case "search": return <SearchScreen />;
    default: return <LanguageScreen />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <AppContent />
      </div>
    </AppProvider>
  );
};

export default App;
