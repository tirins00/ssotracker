import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import TrackRequestsPage from './pages/TrackRequestsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import FAQPage from './pages/FAQPage';
import './styles/index.css';
import { isRequestOverdue } from './utils/requestSla';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarkProvider } from './context/BookmarkContext';

const STORAGE_KEY = 'ssotracker.requests.v1';
const NOTIF_KEY = 'ssotracker.notifications.v1';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const statusFromApi = (status) => {
  const labels = {
    PENDING: 'Pending',
    IN_REVIEW: 'In Review',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
  };
  return labels[status] || status || 'Pending';
};

const parseProcessingDays = (value) => {
  const match = String(value || '').match(/\d+/);
  return match ? Number(match[0]) : 1;
};

const formatProcessingTime = (days) => {
  const count = Number(days) || 1;
  return `${count} day${count === 1 ? '' : 's'} processing`;
};

const mapApiRequest = (request) => ({
  id: String(request.requestId),
  status: statusFromApi(request.status),
  createdAt: request.requestDate ? `${request.requestDate}T00:00:00.000Z` : new Date().toISOString(),
  adminPingedAt: request.adminPingedAt || '',
  studentName: request.studentName || 'Unknown',
  studentEmail: request.studentEmail || '',
  assignedTo: request.assignedStaffEmail || '',
  assignedToName: request.assignedStaffName || '',
  document: {
    id: request.documentId,
    title: request.documentType || request.requestType || 'Document',
    processingTime: formatProcessingTime(request.expectedProcessingTime),
  },
  purpose: request.purpose || request.requestType || '',
  notes: request.notes || '',
});

const notificationTypeFromApi = (type) => String(type || '').toLowerCase();

const notificationTitle = (type) => {
  const labels = {
    submit: 'Request submitted',
    status_update: 'Status updated',
    overdue: 'Request overdue',
    ping: 'Admin pinged',
    assignment: 'Request assigned',
  };
  return labels[type] || 'Notification';
};

const mapApiNotification = (notification) => {
  const type = notificationTypeFromApi(notification.notificationType);
  return {
    id: `api-${notification.notificationId}`,
    requestId: notification.requestId ? String(notification.requestId) : '',
    createdAt: notification.dateSent || new Date().toISOString(),
    type,
    title: notificationTitle(type),
    message: notification.message,
    documentType: notification.documentType || 'Document',
    studentEmail: notification.studentEmail || '',
    assignedStaffEmail: notification.assignedStaffEmail || '',
  };
};

const loadRequests = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
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

const notificationsForUser = (notifications, user) => {
  if (!user) return [];
  if (user.role === 'admin') {
    return notifications.filter((n) => ['ping', 'submit', 'overdue'].includes(n.type));
  }
  if (user.role === 'staff') {
    return notifications.filter((n) => n.assignedStaffEmail === user.email || n.type === 'ping');
  }
  return notifications.filter((n) => !n.studentEmail || n.studentEmail === user.email);
};

// Wraps all authenticated pages with the Sidebar layout
const AppLayout = ({ user, onLogout, showToast, requests, addRequest, pingAdmin, notifications, currentPath, updateRequest, staffMembers, onAssignStaff, onMarkCompleted, onAssignSelf, onUpdateProfile }) => {
  const visibleNotifications = notificationsForUser(notifications, user);

  return (
    <div className="app-shell">
      <Sidebar user={user} onLogout={onLogout} currentPath={currentPath} />
      <main className="main-content">
        <Routes>
          {user.role === 'admin' ? (
            <>
              <Route path="/"                  element={<Navigate to="/admin-dashboard" replace />} />
              <Route path="/admin-dashboard"   element={<AdminDashboardPage user={user} requests={requests} staffMembers={staffMembers} onAssignStaff={onAssignStaff} showToast={showToast} />} />
              <Route path="/profile"           element={<ProfilePage user={user} onUpdateProfile={onUpdateProfile} />} />
              <Route path="/notifications"     element={<NotificationsPage notifications={visibleNotifications} />} />
              <Route path="/faq"               element={<FAQPage />} />
              <Route path="*"                  element={<Navigate to="/admin-dashboard" replace />} />
            </>
          ) : user.role === 'staff' ? (
            <>
              <Route path="/"                  element={<Navigate to="/staff-dashboard" replace />} />
              <Route path="/staff-dashboard"   element={<StaffDashboardPage user={user} requests={requests} onMarkCompleted={onMarkCompleted} onAssignSelf={onAssignSelf} />} />
              <Route path="/profile"           element={<ProfilePage user={user} onUpdateProfile={onUpdateProfile} />} />
              <Route path="/notifications"     element={<NotificationsPage notifications={visibleNotifications} />} />
              <Route path="/faq"               element={<FAQPage />} />
              <Route path="*"                  element={<Navigate to="/staff-dashboard" replace />} />
            </>
          ) : (
            <>
              <Route path="/"                  element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"         element={<DashboardPage user={user} requests={requests} />} />
              <Route path="/submit"            element={<SubmitRequestPage showToast={showToast} onSubmitRequest={addRequest} user={user} />} />
              <Route path="/track"             element={<TrackRequestsPage requests={requests} onPingAdmin={pingAdmin} />} />
              <Route path="/profile"           element={<ProfilePage user={user} onUpdateProfile={onUpdateProfile} />} />
              <Route path="/notifications"     element={<NotificationsPage notifications={visibleNotifications} />} />
              <Route path="/faq"               element={<FAQPage />} />
              <Route path="*"                  element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast,    setToast]    = useState(null);
  const [requests, setRequests] = useState(loadRequests);
  const [notifications, setNotifications] = useState(loadNotifications);
  const [user,     setUser]     = useState({
    displayName: 'Student',
    firstName: 'Student',
    lastName: '',
    email: '',
    role: 'student',
  });

  // Mock staff members list (in a real app, this would come from a backend)
  const staffMembers = [
    { email: 'staff1@cit.edu', name: 'Maria Santos' },
    { email: 'staff2@cit.edu', name: 'Juan Dela Cruz' },
    { email: 'staff3@cit.edu', name: 'Rosa Garcia' },
  ];

  const newId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const showToast = (msg) => setToast(msg);
  const addNotification = (notif) => {
    if (!notif) return;
    setNotifications((prev) => [notif, ...prev]);
  };

  const addRequest = async (req) => {
    let savedRequest = req;

    try {
      const response = await fetch(`${API_BASE_URL}/document-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: req.studentName,
          studentEmail: req.studentEmail,
          documentId: req.document.id,
          requestType: req.document.title,
          expectedProcessingTime: parseProcessingDays(req.document.processingTime),
          purpose: req.purpose,
          notes: req.notes,
        }),
      });

      if (!response.ok) throw new Error('Unable to save document request');
      savedRequest = mapApiRequest(await response.json());
    } catch {
      showToast('Backend is offline. Request saved locally for now.');
    }

    setRequests((prev) => [savedRequest, ...prev]);
    addNotification({
      id: newId(),
      requestId: savedRequest.id,
      createdAt: new Date().toISOString(),
      type: 'submit',
      title: savedRequest === req ? 'Request saved locally' : 'Request submitted',
      message: `Your request for "${savedRequest?.document?.title || 'Document'}" has been submitted.`,
      documentType: savedRequest?.document?.title || 'Document',
      studentEmail: savedRequest.studentEmail || user.email,
    });
  };

  const updateRequest = (requestId, patch) => {
    if (!requestId) return;
    setRequests((prev) => prev.map((r) => (r?.id === requestId ? { ...r, ...patch } : r)));
  };

  const assignStaffToRequest = async (requestId, staffEmail) => {
    if (!requestId) return;
    if (!staffEmail) {
      updateRequest(requestId, { assignedTo: '', assignedToName: '', status: 'Pending' });
      showToast('Staff assignment cleared locally');
      return;
    }

    const staffName = staffMembers.find((staff) => staff.email === staffEmail)?.name || '';

    try {
      const response = await fetch(`${API_BASE_URL}/document-requests/${requestId}/assignment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffEmail }),
      });
      if (!response.ok) throw new Error('Unable to assign staff');
      updateRequest(requestId, mapApiRequest(await response.json()));
      showToast('Staff member assigned to request');
    } catch {
      updateRequest(requestId, { assignedTo: staffEmail, assignedToName: staffName, status: 'In Review' });
      showToast('Backend assignment failed. Assignment saved locally for now.');
    }
  };

  const markRequestAsCompleted = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/document-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
      if (!response.ok) throw new Error('Unable to complete request');
      updateRequest(requestId, { ...mapApiRequest(await response.json()), completedAt: new Date().toISOString() });
      showToast('Request marked as completed');
    } catch {
      updateRequest(requestId, { status: 'Completed', completedAt: new Date().toISOString() });
      showToast('Backend is offline. Completion saved locally for now.');
    }
  };

  const assignSelfToRequest = (requestId) => {
    updateRequest(requestId, { assignedTo: user.email });
    showToast('Request assigned to you');
  };

  const pingAdmin = async (req) => {
    if (!req?.id) return;
    const pingedAt = new Date().toISOString();
    updateRequest(req.id, { adminPingedAt: pingedAt });

    try {
      const response = await fetch(`${API_BASE_URL}/document-requests/${req.id}/ping-admin`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Unable to ping admin');
      const notification = mapApiNotification(await response.json());
      addNotification(notification);
      showToast('Admin has been notified about your overdue request.');
    } catch {
      addNotification({
        id: newId(),
        requestId: req.id,
        createdAt: pingedAt,
        type: 'ping',
        title: 'Admin pinged',
        message: `Student pinged for "${req?.document?.title || 'Document'}" request.`,
        documentType: req?.document?.title || 'Document',
        studentEmail: req.studentEmail || user.email,
      });
      showToast('Backend is offline. Ping saved locally for now.');
    }
  };

  const updateProfile = (profileData) => {
    setUser((prev) => ({
      ...prev,
      email: profileData.email || prev.email,
      firstName: profileData.firstName || prev.firstName,
      lastName: profileData.lastName || prev.lastName,
      displayName: `${profileData.lastName || prev.lastName} ${profileData.firstName || prev.firstName}`,
    }));
    showToast('Profile updated successfully!');
  };

  useEffect(() => {
    if (!loggedIn) return;

    let active = true;

    const loadBackendRequests = async () => {
      try {
        const [requestResponse, notificationResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/document-requests`),
          fetch(`${API_BASE_URL}/notifications`),
        ]);

        if (!requestResponse.ok) throw new Error('Unable to load document requests');
        const requestData = await requestResponse.json();
        if (active && Array.isArray(requestData)) {
          setRequests(requestData.map(mapApiRequest).reverse());
        }

        if (notificationResponse.ok) {
          const notificationData = await notificationResponse.json();
          if (active && Array.isArray(notificationData)) {
            setNotifications(notificationData.map(mapApiNotification));
          }
        }
      } catch {
        // Keep local storage data when the backend is not running.
      }
    };

    loadBackendRequests();

    return () => {
      active = false;
    };
  }, [loggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }
  }, [requests, user.email]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }
  }, [notifications]);

  useEffect(() => {
    // Create a one-time notification when a request becomes overdue.
    const now = new Date();
    let changed = false;
    const updated = requests.map((r) => {
      if (!r || r.overdueNotifiedAt) return r;
      if (!isRequestOverdue(r, now)) return r;
      changed = true;
      addNotification({
        id: newId(),
        requestId: r.id,
        createdAt: new Date().toISOString(),
        type: 'overdue',
        title: 'Request overdue',
        message: `Your request for "${r?.document?.title || 'Document'}" is overdue. You can ping the admin from Track Requests.`,
        documentType: r?.document?.title || 'Document',
        studentEmail: r.studentEmail || user.email,
      });
      return { ...r, overdueNotifiedAt: new Date().toISOString() };
    });

    if (changed) setRequests(updated);
  }, [requests, user.email]);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <BookmarkProvider>
          {loggedIn ? (
            <>
              <AppLayout
                user={user}
                onLogout={() => {
                  setLoggedIn(false);
                  setUser({
                    displayName: 'Student',
                    firstName: 'Student',
                    lastName: '',
                    email: '',
                    role: 'student',
                  });
                }}
                showToast={showToast}
                requests={requests}
                addRequest={addRequest}
                pingAdmin={pingAdmin}
                notifications={notifications}
                updateRequest={updateRequest}
                staffMembers={staffMembers}
                onAssignStaff={assignStaffToRequest}
                onMarkCompleted={markRequestAsCompleted}
                onAssignSelf={assignSelfToRequest}
                onUpdateProfile={updateProfile}
              />
              {toast && <Toast message={toast} onDone={() => setToast(null)} />}
            </>
          ) : (
            <Routes>
              <Route
                path="*"
                element={(
                  <LoginPage
                    onLogin={(email, role = 'student') => {
                      const parsed = nameFromEmail(email);
                      setUser({ ...parsed, email, role });
                      setLoggedIn(true);
                    }}
                  />
                )}
              />
            </Routes>
          )}
        </BookmarkProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
