import { useState } from 'react';
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

const AdminDashboardPage = ({ user, requests = [], staffMembers = [], onAssignStaff, onUpdateStatus }) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const now = new Date();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'Pending').length;
  const inProgress = requests.filter((r) => r.status === 'In Review' || r.status === 'Processing').length;
  const completed = requests.filter((r) => r.status === 'Completed').length;
  const overdue = requests.filter((r) => isRequestOverdue(r, now)).length;

  const stats = [
    { className: 'stat-total',    iconName: 'file',   iconColor: '#7b1a1a', count: total,      label: 'Total Requests' },
    { className: 'stat-pending',  iconName: 'bell',   iconColor: '#d97706', count: pending,    label: 'Pending'        },
    { className: 'stat-progress', iconName: 'submit', iconColor: '#0284c7', count: inProgress, label: 'In Progress'    },
    { className: 'stat-done',     iconName: 'track',  iconColor: '#16a34a', count: completed,  label: 'Completed'      },
  ];

  const filteredRequests = filterStatus === 'All'
    ? requests
    : requests.filter((r) => r.status === filterStatus);

  return (
    <div>
      <div className="dash-date">{dateStr}</div>
      <div className="dash-welcome">Welcome, Admin {user?.firstName || ''}!</div>

      <div className="stats-row">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.className}`}>
            <div className="stat-icon">
              <Icon name={s.iconName} size={18} color={s.iconColor} />
            </div>
            <div className="stat-num">{s.count}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {overdue > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13.5px', color: '#b91c1c' }}>
            <strong>{overdue}</strong> request{overdue !== 1 ? 's' : ''} overdue
          </p>
        </div>
      )}

      <div className="section-header">
        <span className="section-title">All Requests</span>
      </div>

      <div className="filter-tabs">
        {['All', 'Pending', 'In Review', 'Processing', 'Completed', 'Rejected'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-card">
          <Icon name="file" size={40} color="#ddd" />
          <p>No requests found</p>
        </div>
      ) : (
        <div className="req-table">
          <div className="req-head">
            <div>Document</div>
            <div>Student</div>
            <div>Status</div>
            <div>Assigned To</div>
            <div>Action</div>
          </div>
          {filteredRequests.map((r) => {
            const due = getDueDate(r);
            const overdueReq = isRequestOverdue(r, now);
            const pingedAt = r?.adminPingedAt ? new Date(r.adminPingedAt) : null;
            const hasPinged = pingedAt && !Number.isNaN(pingedAt.getTime());

            return (
              <div className="req-row" key={r.id}>
                <div className="req-doc">
                  <div className="req-title">{r.document?.title || 'Unknown'}</div>
                  <div className="req-sub">{r.document?.processingTime || ''}</div>
                </div>
                <div style={{ fontSize: '13.5px', color: '#555' }}>
                  <div>{r.studentName || 'Unknown'}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{r.studentEmail || ''}</div>
                </div>
                <div>
                  <span className={`status-badge status-${(r.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}>
                    {r.status || 'Pending'}
                  </span>
                  {overdueReq && <span className="overdue-badge">Overdue</span>}
                  {hasPinged && (
                    <div style={{ fontSize: '11px', color: '#d97706', marginTop: '4px', fontWeight: '600' }}>
                      📌 Pinged
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '13.5px', color: '#555' }}>
                  {r.assignedTo ? staffMembers.find((s) => s.email === r.assignedTo)?.name || 'Unknown' : '—'}
                </div>
                <div className="req-action">
                  <select
                    value={r.assignedTo || ''}
                    onChange={(e) => {
                      const staffEmail = e.target.value;
                      if (typeof onAssignStaff === 'function') onAssignStaff(r.id, staffEmail);
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                      fontSize: '13px',
                      cursor: 'pointer',
                      background: '#fff',
                      color: '#555',
                    }}
                  >
                    <option value="">Assign staff...</option>
                    {staffMembers.map((staff) => (
                      <option key={staff.email} value={staff.email}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
