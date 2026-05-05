import Icon from '../components/Icon';
import { getDueDate, isRequestOverdue } from '../utils/requestSla';

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

const formatShortDate = (d) => {
  try {
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  } catch {
    return '';
  }
};

const StaffDashboardPage = ({ user, requests = [], onMarkCompleted, onAssignSelf, onUnassign }) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const staffId = user?.email || '';
  const now = new Date();

  // Get requests assigned to this staff member
  const assignedRequests = requests.filter((r) => r.assignedTo === staffId);
  const pendingAssigned = assignedRequests.filter((r) => r.status !== 'Completed' && r.status !== 'Rejected');
  const completedAssigned = assignedRequests.filter((r) => r.status === 'Completed');

  // Get pinged requests (overdue requests from students)
  const unassignedPinged = requests.filter((r) => {
    const pingedAt = r?.adminPingedAt ? new Date(r.adminPingedAt) : null;
    const hasPinged = pingedAt && !Number.isNaN(pingedAt.getTime());
    return hasPinged && !r.assignedTo && r.status !== 'Completed' && r.status !== 'Rejected';
  });

  const stats = [
    { className: 'stat-total',    iconName: 'file',   iconColor: '#7b1a1a', count: pendingAssigned.length,  label: 'Assigned'        },
    { className: 'stat-progress', iconName: 'submit', iconColor: '#0284c7', count: unassignedPinged.length, label: 'Pinged'         },
    { className: 'stat-done',     iconName: 'track',  iconColor: '#16a34a', count: completedAssigned.length, label: 'Completed'      },
  ];

  return (
    <div>
      <div className="dash-date">{dateStr}</div>
      <div className="dash-welcome">Welcome back, {user?.firstName || 'Staff'}!</div>

      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.className}`}>
            <div className="stat-icon" style={{ background: `${s.iconColor}20` }}>
              <Icon name={s.iconName} size={18} color={s.iconColor} />
            </div>
            <div className="stat-num">{s.count}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {unassignedPinged.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Pinged Requests</span>
          </div>
          <div style={{ background: '#fff9f0', border: '1px solid #fcd34d', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '13.5px', color: '#92400e', marginBottom: '12px' }}>
              <strong>{unassignedPinged.length}</strong> student{unassignedPinged.length !== 1 ? 's' : ''} pinged for overdue request{unassignedPinged.length !== 1 ? 's' : ''}
            </p>
            <div className="req-table">
              <div className="req-head">
                <div>Document</div>
                <div>Student</div>
                <div>Status</div>
                <div>Pinged At</div>
                <div>Action</div>
              </div>
              {unassignedPinged.map((r) => (
                <div className="req-row" key={r.id}>
                  <div className="req-doc">
                    <div className="req-title">{r.document?.title || 'Unknown'}</div>
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#555' }}>{r.studentEmail || 'Unknown'}</div>
                  <div>
                    <span className={`status-badge status-${(r.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}>
                      {r.status || 'Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#555' }}>
                    {formatDateTime(r.adminPingedAt)}
                  </div>
                  <div className="req-action">
                    <button
                      className="ping-btn"
                      onClick={() => {
                        if (typeof onAssignSelf === 'function') onAssignSelf(r.id);
                      }}
                    >
                      Assign to Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="section-header">
        <span className="section-title">Assigned Requests</span>
      </div>

      {pendingAssigned.length === 0 ? (
        <div className="empty-card">
          <Icon name="file" size={40} color="#ddd" />
          <p>No assigned requests</p>
        </div>
      ) : (
        <div className="req-table">
          <div className="req-head">
            <div>Document</div>
            <div>Submitted</div>
            <div>Status</div>
            <div>Purpose</div>
            <div>Action</div>
          </div>
          {pendingAssigned.map((r) => {
            const due = getDueDate(r);
            const overdue = isRequestOverdue(r, now);
            return (
              <div className="req-row" key={r.id}>
                <div className="req-doc">
                  <div className="req-title">{r.document?.title || 'Unknown Document'}</div>
                  <div className="req-sub">{r.document?.processingTime || ''}</div>
                </div>
                <div className="req-date">
                  <div>{formatDateTime(r.createdAt)}</div>
                  {due && (
                    <div className={`req-due ${overdue ? 'overdue' : ''}`}>
                      Due {formatShortDate(due)}
                    </div>
                  )}
                </div>
                <div>
                  <span className={`status-badge status-${(r.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}>
                    {r.status || 'Pending'}
                  </span>
                  {overdue && <span className="overdue-badge">Overdue</span>}
                </div>
                <div className="req-purpose">{r.purpose}</div>
                <div className="req-action">
                  <button
                    className="ping-btn"
                    onClick={() => {
                      if (typeof onMarkCompleted === 'function') onMarkCompleted(r.id);
                    }}
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffDashboardPage;
