import { useState } from 'react';
import Icon from '../components/Icon';

const TABS = ['All Requests', 'Pending', 'In Review', 'Processing', 'Completed', 'Rejected'];

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

const TrackRequestsPage = ({ requests = [] }) => {
  const [activeTab, setActiveTab] = useState('All Requests');

  const filtered = requests.filter((r) => {
    if (activeTab === 'All Requests') return true;
    return r.status === activeTab;
  });

  return (
    <div>
      <div className="page-title">Track Requests</div>
      <div className="page-sub">View and monitor all your document requests</div>
      <div className="filter-tabs">
        {TABS.map((tab) => (
          <button key={tab} className={`filter-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-card">
          <Icon name="file" size={40} color="#ddd" />
          <p>No requests found</p>
        </div>
      ) : (
        <div className="req-table">
          <div className="req-head">
            <div>Document</div>
            <div>Submitted</div>
            <div>Status</div>
            <div>Purpose</div>
          </div>
          {filtered.map((r) => (
            <div className="req-row" key={r.id}>
              <div className="req-doc">
                <div className="req-title">{r.document?.title || 'Unknown Document'}</div>
                <div className="req-sub">{r.document?.processingTime || ''}</div>
              </div>
              <div className="req-date">{formatDateTime(r.createdAt)}</div>
              <div>
                <span className={`status-badge status-${(r.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}>
                  {r.status || 'Pending'}
                </span>
              </div>
              <div className="req-purpose">{r.purpose}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackRequestsPage;
