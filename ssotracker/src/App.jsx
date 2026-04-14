import { useEffect, useState } from 'react';
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

const STORAGE_KEY = 'ssotracker.requests.v1';

const loadRequests = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const isVowel = (ch) => VOWELS.has((ch || '').toLowerCase());

const titleCase = (s) => {
  const str = (s || '').trim();
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

// Best-effort parsing:
// - If the local part has separators (., _, -), split on them.
// - Otherwise, heuristically split into first+last (for emails like "denzelvalendez@cit.edu").
const nameFromEmail = (email) => {
  const raw = (email || '').trim().toLowerCase();
  const local = raw.split('@')[0] || '';

  // e.g. denzel.valendez -> ["denzel","valendez"]
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    return {
      firstName: titleCase(first),
      lastName: titleCase(last),
      displayName: `${titleCase(last)} ${titleCase(first)}`,
    };
  }

  const s = parts[0] || local;
  if (s.length < 6) {
    const only = titleCase(s);
    return { firstName: only, lastName: '', displayName: only };
  }

  // Heuristic boundary search: pick the split that "looks" most like two names.
  let best = { score: -Infinity, i: Math.floor(s.length / 2) };
  for (let i = 3; i <= s.length - 3; i++) {
    const a = s.slice(0, i);
    const b = s.slice(i);
    const aHasVowel = [...a].some(isVowel);
    const bHasVowel = [...b].some(isVowel);
    if (!aHasVowel || !bHasVowel) continue;

    let score = 0;
    if (i >= 4 && i <= 8) score += 5;
    if (b.length >= a.length) score += 3;

    const left = s[i - 1];
    const right = s[i];
    if (!isVowel(left) && !isVowel(right)) score += 2;
    if (isVowel(left) && isVowel(right)) score -= 4;

    // Prefer "smoother" looking segments (fewer odd clusters).
    if (/(.)\1\1/.test(a) || /(.)\1\1/.test(b)) score -= 3;

    if (score > best.score) best = { score, i };
  }

  const firstRaw = s.slice(0, best.i);
  const lastRaw = s.slice(best.i);
  const firstName = titleCase(firstRaw);
  const lastName = titleCase(lastRaw);
  return { firstName, lastName, displayName: `${lastName} ${firstName}` };
};

// Wraps all authenticated pages with the Sidebar layout
const AppLayout = ({ user, onLogout, showToast, requests, addRequest, currentPath }) => {
  return (
    <div className="app-shell">
      <Sidebar user={user} onLogout={onLogout} currentPath={currentPath} />
      <main className="main-content">
        <Routes>
          <Route path="/"                  element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"         element={<DashboardPage user={user} requests={requests} />} />
          <Route path="/submit"            element={<SubmitRequestPage showToast={showToast} onSubmitRequest={addRequest} />} />
          <Route path="/track"             element={<TrackRequestsPage requests={requests} />} />
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
  const [requests, setRequests] = useState(loadRequests);
  const [user,     setUser]     = useState({
    displayName: 'Student',
    firstName: 'Student',
    lastName: '',
    email: '',
  });

  const showToast = (msg) => setToast(msg);
  const addRequest = (req) => setRequests((prev) => [req, ...prev]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }
  }, [requests]);

  return (
    <BrowserRouter>
      {loggedIn ? (
        <>
          <AppLayout
            user={user}
            onLogout={() => setLoggedIn(false)}
            showToast={showToast}
            requests={requests}
            addRequest={addRequest}
          />
          {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        </>
      ) : (
        <Routes>
          <Route
            path="*"
            element={(
              <LoginPage
                onLogin={(email) => {
                  const parsed = nameFromEmail(email);
                  setUser({ ...parsed, email });
                  setLoggedIn(true);
                }}
              />
            )}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
