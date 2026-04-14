import StatCard from '../components/StatCard';
import Icon from '../components/Icon';
import { useNavigate } from 'react-router-dom';

const DashboardPage = ({ user, requests = [] }) => {
  const navigate = useNavigate();
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const firstName = user?.firstName || 'Student';

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'Pending').length;
  const inProgress = requests.filter((r) => r.status === 'In Review' || r.status === 'Processing').length;
  const completed = requests.filter((r) => r.status === 'Completed').length;
  const activeCount = requests.filter((r) => r.status !== 'Completed' && r.status !== 'Rejected').length;

  const stats = [
    { className: 'stat-total',    iconName: 'file',   iconColor: '#7b1a1a', count: total,      label: 'Total Requests' },
    { className: 'stat-pending',  iconName: 'bell',   iconColor: '#d97706', count: pending,    label: 'Pending'        },
    { className: 'stat-progress', iconName: 'submit', iconColor: '#0284c7', count: inProgress, label: 'In Progress'    },
    { className: 'stat-done',     iconName: 'track',  iconColor: '#16a34a', count: completed,  label: 'Completed'      },
  ];

  return (
    <div>
      <div className="dash-date">{dateStr}</div>
      <div className="dash-welcome">Welcome back, {firstName}!</div>

      <div className="stats-row">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="section-header">
        <span className="section-title">Active Requests</span>
        <button className="view-all" onClick={() => navigate('/track')}>
          View all <Icon name="chevRight" size={14} />
        </button>
      </div>

      {activeCount === 0 ? (
        <div className="empty-card">
          <Icon name="file" size={40} color="#ddd" />
          <p>No active requests</p>
          <button className="submit-btn-big" onClick={() => navigate('/submit')}>
            <Icon name="plus" size={16} color="#fff" />
            Submit a Request
          </button>
        </div>
      ) : (
        <div className="active-summary-card">
          <div className="active-summary-left">
            <div className="active-icon">
              <Icon name="file" size={18} color="#7b1a1a" />
            </div>
            <div>
              <div className="active-title">{activeCount} active request{activeCount === 1 ? '' : 's'}</div>
              <div className="active-sub">View details and status updates in Track Requests.</div>
            </div>
          </div>
          <button className="submit-btn-big" onClick={() => navigate('/track')}>
            Track Requests <Icon name="chevRight" size={15} color="#fff" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
