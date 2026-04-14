import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import TrackRequestsPage from './pages/TrackRequestsPage';
import NotificationsPage from './pages/NotificationsPage';
import FAQPage from './pages/FAQPage';
import './styles/index.css';

const CURRENT_USER = { name: 'Denzel', id: 'STU-P30W0' };

// Wraps all authenticated pages with the Sidebar layout
const AppLayout = ({ onLogout, showToast, currentPath }) => {
  return (
    <div className="app-shell">
      <Sidebar user={CURRENT_USER} onLogout={onLogout} currentPath={currentPath} />
      <main className="main-content">
        <Routes>
          <Route path="/"                  element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"         element={<DashboardPage />} />
          <Route path="/submit"            element={<SubmitRequestPage showToast={showToast} />} />
          <Route path="/track"             element={<TrackRequestsPage />} />
          <Route path="/notifications"     element={<NotificationsPage />} />
          <Route path="/faq"               element={<FAQPage />} />
          <Route path="*"                  element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (msg) => setToast(msg);

  return (
    <BrowserRouter>
      {loggedIn ? (
        <>
          <AppLayout
            onLogout={() => setLoggedIn(false)}
            showToast={showToast}
          />
          {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        </>
      ) : (
        <Routes>
          <Route path="*" element={<LoginPage onLogin={() => setLoggedIn(true)} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;