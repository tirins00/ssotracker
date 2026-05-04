import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { isRequestOverdue } from '../utils/requestSla';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const emptyAdminForm = {
  firstName: '',
  lastName: '',
  email: '',
  position: '',
  active: true,
};

const AdminDashboardPage = ({ user, requests = [], staffMembers = [], onAssignStaff, showToast }) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const now = new Date();
  const [filterStatus, setFilterStatus] = useState('All');
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminForm, setAdminForm] = useState(emptyAdminForm);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [adminCrudLoading, setAdminCrudLoading] = useState(false);
  const [adminCrudError, setAdminCrudError] = useState('');

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

  const notify = (message) => {
    if (typeof showToast === 'function') showToast(message);
  };

  const loadAdminUsers = async () => {
    setAdminCrudLoading(true);
    setAdminCrudError('');
    try {
      const response = await fetch(`${API_BASE_URL}/admin-users`);
      if (!response.ok) throw new Error('Unable to load admin users');
      const data = await response.json();
      setAdminUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setAdminCrudError('Spring Boot API is not reachable. Start the backend on port 8080.');
    } finally {
      setAdminCrudLoading(false);
    }
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const handleAdminField = (field, value) => {
    setAdminForm((current) => ({ ...current, [field]: value }));
  };

  const resetAdminForm = () => {
    setAdminForm(emptyAdminForm);
    setEditingAdminId(null);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminCrudLoading(true);
    setAdminCrudError('');
    try {
      const url = editingAdminId
        ? `${API_BASE_URL}/admin-users/${editingAdminId}`
        : `${API_BASE_URL}/admin-users`;
      const response = await fetch(url, {
        method: editingAdminId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });
      if (!response.ok) throw new Error('Unable to save admin user');
      await loadAdminUsers();
      resetAdminForm();
      notify(editingAdminId ? 'Admin user updated' : 'Admin user created');
    } catch (error) {
      setAdminCrudError('Admin user could not be saved. Check the backend and email uniqueness.');
    } finally {
      setAdminCrudLoading(false);
    }
  };

  const editAdmin = (admin) => {
    setEditingAdminId(admin.adminId);
    setAdminForm({
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
      email: admin.email || '',
      position: admin.position || '',
      active: admin.active !== false,
    });
  };

  const deleteAdmin = async (adminId) => {
    setAdminCrudLoading(true);
    setAdminCrudError('');
    try {
      const response = await fetch(`${API_BASE_URL}/admin-users/${adminId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete admin user');
      await loadAdminUsers();
      if (editingAdminId === adminId) resetAdminForm();
      notify('Admin user deleted');
    } catch (error) {
      setAdminCrudError('Admin user could not be deleted.');
    } finally {
      setAdminCrudLoading(false);
    }
  };

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

      <div className="admin-crud-panel">
        <div className="section-header">
          <span className="section-title">Admin Users</span>
          <button className="track-clear" type="button" onClick={loadAdminUsers} disabled={adminCrudLoading}>
            Refresh
          </button>
        </div>

        <form className="admin-crud-form" onSubmit={handleAdminSubmit}>
          <input
            className="form-input"
            placeholder="First name"
            value={adminForm.firstName}
            onChange={(e) => handleAdminField('firstName', e.target.value)}
            required
          />
          <input
            className="form-input"
            placeholder="Last name"
            value={adminForm.lastName}
            onChange={(e) => handleAdminField('lastName', e.target.value)}
            required
          />
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={adminForm.email}
            onChange={(e) => handleAdminField('email', e.target.value)}
            required
          />
          <input
            className="form-input"
            placeholder="Position"
            value={adminForm.position}
            onChange={(e) => handleAdminField('position', e.target.value)}
            required
          />
          <label className="admin-active-toggle">
            <input
              type="checkbox"
              checked={adminForm.active}
              onChange={(e) => handleAdminField('active', e.target.checked)}
            />
            Active
          </label>
          <div className="admin-crud-actions">
            <button className="btn-next" type="submit" disabled={adminCrudLoading}>
              <Icon name={editingAdminId ? 'check' : 'plus'} size={15} color="#fff" />
              {editingAdminId ? 'Update' : 'Create'}
            </button>
            {editingAdminId && (
              <button className="btn-back" type="button" onClick={resetAdminForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {adminCrudError && <div className="admin-crud-error">{adminCrudError}</div>}

        <div className="admin-user-table">
          <div className="admin-user-head">
            <div>Name</div>
            <div>Email</div>
            <div>Position</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {adminUsers.length === 0 ? (
            <div className="admin-user-empty">{adminCrudLoading ? 'Loading admin users...' : 'No admin users found'}</div>
          ) : (
            adminUsers.map((admin) => (
              <div className="admin-user-row" key={admin.adminId}>
                <div className="req-title">{admin.firstName} {admin.lastName}</div>
                <div className="req-sub">{admin.email}</div>
                <div>{admin.position}</div>
                <div>
                  <span className={`status-badge ${admin.active ? 'status-completed' : 'status-rejected'}`}>
                    {admin.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="admin-user-actions">
                  <button className="track-clear" type="button" onClick={() => editAdmin(admin)}>
                    Edit
                  </button>
                  <button className="track-clear danger" type="button" onClick={() => deleteAdmin(admin.adminId)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
