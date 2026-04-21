import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';

const formatDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const iconFor = (type, isDarkMode = false) => {
  // Light mode backgrounds
  if (!isDarkMode) {
    if (type === 'submit') return { name: 'submit', bg: '#fdf2f2', color: '#7b1a1a' };
    if (type === 'overdue') return { name: 'file', bg: '#fef2f2', color: '#b91c1c' };
    if (type === 'ping') return { name: 'bell', bg: '#fffbeb', color: '#b45309' };
    return { name: 'bell', bg: '#f5f5f5', color: '#777' };
  }
  
  // Dark mode backgrounds
  if (type === 'submit') return { name: 'submit', bg: '#3a2422', color: '#ff6b6b' };
  if (type === 'overdue') return { name: 'file', bg: '#3a2222', color: '#ff7373' };
  if (type === 'ping') return { name: 'bell', bg: '#3a3220', color: '#ffa500' };
  return { name: 'bell', bg: '#2d2d2d', color: '#999' };
};

const NotificationsPage = ({ notifications = [] }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div>
      <div className="page-title">Notifications</div>
      <div className="page-sub">Stay updated on your request status</div>

      {notifications.length === 0 ? (
        <div className="notif-empty">
          <Icon name="bell" size={44} color="#ddd" />
          <p>No notifications</p>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map((n) => {
            const meta = iconFor(n.type, isDarkMode);
            return (
              <div key={n.id} className="notif-item">
                <div className="notif-icon" style={{ background: meta.bg }}>
                  <Icon name={meta.name} size={16} color={meta.color} />
                </div>
                <div className="notif-body">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-msg">{n.message}</div>
                </div>
                <div className="notif-time">{formatDateTime(n.createdAt)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
