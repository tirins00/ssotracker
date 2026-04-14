import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';

const NAV_ITEMS = [
  { path: '/dashboard',     label: 'Dashboard',      icon: 'dashboard' },
  { path: '/submit',        label: 'Submit Request',  icon: 'submit'    },
  { path: '/track',         label: 'Track Requests',  icon: 'track'     },
  { path: '/notifications', label: 'Notifications',   icon: 'bell'      },
  { path: '/faq',           label: 'FAQ',             icon: 'faq'       },
];

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const avatarLetter = (user?.firstName?.[0] || user?.displayName?.[0] || '?').toUpperCase();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Icon name="cap" size={18} color="#fff" />
        </div>
        <div className="logo-text">
          <div className="name">CIT-U SSO</div>
          <div className="sub">Request Tracker</div>
        </div>
      </div>

      {/* Nav Links */}
      <div className="sidebar-section-label">Student Portal</div>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          <Icon name={item.icon} size={16} />
          {item.label}
        </Link>
      ))}

      {/* User + Logout */}
      <div className="sidebar-bottom">
        <div className="user-row">
          <div className="user-avatar">{avatarLetter}</div>
          <div className="user-info">
            <div className="uname">{user?.displayName || 'Student'}</div>
            <div className="uid">{user?.email || ''}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <Icon name="logout" size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
