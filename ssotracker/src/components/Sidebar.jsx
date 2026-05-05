import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useTheme } from '../context/ThemeContext';

const STUDENT_NAV_ITEMS = [
  { path: '/dashboard',     label: 'Dashboard',      icon: 'dashboard' },
  { path: '/submit',        label: 'Submit Request',  icon: 'submit'    },
  { path: '/track',         label: 'Track Requests',  icon: 'track'     },
  { path: '/notifications', label: 'Notifications',   icon: 'bell'      },
  { path: '/faq',           label: 'FAQ',             icon: 'faq'       },
];

const STAFF_NAV_ITEMS = [
  { path: '/staff-dashboard', label: 'Dashboard',      icon: 'dashboard' },
  { path: '/notifications',   label: 'Notifications',   icon: 'bell'      },
  { path: '/faq',             label: 'FAQ',             icon: 'faq'       },
];

const ADMIN_NAV_ITEMS = [
  { path: '/admin-dashboard', label: 'Dashboard',      icon: 'dashboard' },
  { path: '/notifications',   label: 'Notifications',   icon: 'bell'      },
  { path: '/faq',             label: 'FAQ',             icon: 'faq'       },
];

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const avatarLetter = (user?.firstName?.[0] || user?.displayName?.[0] || '?').toUpperCase();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getNavItems = () => {
    if (user?.role === 'admin') return ADMIN_NAV_ITEMS;
    if (user?.role === 'staff') return STAFF_NAV_ITEMS;
    return STUDENT_NAV_ITEMS;
  };

  const getSectionLabel = () => {
    if (user?.role === 'admin') return 'Admin Portal';
    if (user?.role === 'staff') return 'Staff Portal';
    return 'Student Portal';
  };

  const navItems = getNavItems();

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
      <div className="sidebar-section-label">{getSectionLabel()}</div>
      {navItems.map((item) => (
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
        <button className="user-row" onClick={handleProfileClick} style={{ cursor: 'pointer', border: 'none', background: 'none', width: '100%', padding: '0' }}>
          <div className="user-avatar">{avatarLetter}</div>
          <div className="user-info">
            <div className="uname">{user?.displayName || 'Student'}</div>
            <div className="uid">{user?.email || ''}</div>
          </div>
        </button>
        <button className="logout-btn" onClick={toggleTheme} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          <Icon name={isDarkMode ? 'sun' : 'moon'} size={15} />
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="logout-btn" onClick={onLogout}>
          <Icon name="logout" size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
