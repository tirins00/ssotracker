import StatCard from '../components/StatCard';
import Icon from '../components/Icon';

const STATS = [
  { className: 'stat-total',    iconName: 'file',   iconColor: '#7b1a1a', count: 0, label: 'Total Requests' },
  { className: 'stat-pending',  iconName: 'bell',   iconColor: '#d97706', count: 0, label: 'Pending'        },
  { className: 'stat-progress', iconName: 'submit', iconColor: '#0284c7', count: 0, label: 'In Progress'    },
  { className: 'stat-done',     iconName: 'track',  iconColor: '#16a34a', count: 0, label: 'Completed'      },
];

const DashboardPage = ({ setPage }) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div>
      <div className="dash-date">{dateStr}</div>
      <div className="dash-welcome">Welcome back, Denzel!</div>

      <div className="stats-row">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="section-header">
        <span className="section-title">Active Requests</span>
        <button className="view-all" onClick={() => setPage('track')}>
          View all <Icon name="chevRight" size={14} />
        </button>
      </div>

      <div className="empty-card">
        <Icon name="file" size={40} color="#ddd" />
        <p>No active requests</p>
        <button className="submit-btn-big" onClick={() => setPage('submit')}>
          <Icon name="plus" size={16} color="#fff" />
          Submit a Request
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;