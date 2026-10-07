import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { DriverCockpitPage } from './pages/DriverCockpitPage';
import { GateTerminalPage } from './pages/GateTerminalPage';
import { ConductorRollCallPage } from './pages/ConductorRollCallPage';
import { StudentBusPage } from './pages/StudentBusPage';
import { FleetManagementPage } from './pages/FleetManagementPage';
import { LoginPage } from './pages/LoginPage';
import { UserRole } from './types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-w-0 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};

const RoleHomeRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'driver':
      return <Navigate to="/driver-cockpit" replace />;
    case 'watchman':
      return <Navigate to="/gate-terminal" replace />;
    case 'mentor':
      return <Navigate to="/roll-call" replace />;
    case 'student':
      return <Navigate to="/my-pass" replace />;
    case 'admin':
    default:
      return <DashboardPage />;
  }
};

const RoleGuard: React.FC<{ allowedRoles: UserRole[]; children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <RoleHomeRedirect />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout><RoleHomeRedirect /></Layout>} />
          <Route path="/tracking" element={<Layout><LiveTrackingPage /></Layout>} />
          <Route
            path="/driver-cockpit"
            element={
              <Layout>
                <RoleGuard allowedRoles={['admin', 'driver']}>
                  <DriverCockpitPage />
                </RoleGuard>
              </Layout>
            }
          />
          <Route
            path="/gate-terminal"
            element={
              <Layout>
                <RoleGuard allowedRoles={['admin', 'watchman']}>
                  <GateTerminalPage />
                </RoleGuard>
              </Layout>
            }
          />
          <Route
            path="/roll-call"
            element={
              <Layout>
                <RoleGuard allowedRoles={['admin', 'mentor', 'driver']}>
                  <ConductorRollCallPage />
                </RoleGuard>
              </Layout>
            }
          />
          <Route
            path="/my-pass"
            element={
              <Layout>
                <RoleGuard allowedRoles={['admin', 'student']}>
                  <StudentBusPage />
                </RoleGuard>
              </Layout>
            }
          />
          <Route
            path="/fleet"
            element={
              <Layout>
                <RoleGuard allowedRoles={['admin']}>
                  <FleetManagementPage />
                </RoleGuard>
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
