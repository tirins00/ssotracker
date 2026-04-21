import { useState } from 'react';
import Icon from '../components/Icon';
import { formatShortDate, getDueDate, isRequestOverdue } from '../utils/requestSla';
import { useBookmarks } from '../context/BookmarkContext';

const TABS = ['All Requests', 'Pending', 'In Review', 'Processing', 'Completed', 'Rejected'];

const toYMD = (d) => {
  try {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
};

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

const TrackRequestsPage = ({ requests = [], onPingAdmin }) => {
  const [activeTab, setActiveTab] = useState('All Requests');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const now = new Date();

  const filtered = requests.filter((r) => {
    if (activeTab === 'All Requests') return true;
    return r.status === activeTab;
  }).filter((r) => {
    const createdAt = r?.createdAt ? new Date(r.createdAt) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) return true;

    const ymd = toYMD(createdAt);
    if (fromDate && ymd < fromDate) return false;
    if (toDate && ymd > toDate) return false;
    return true;
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

      <div className="track-filters">
        <div className="track-filter">
          <label>From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="track-filter">
          <label>To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <button
          className="track-clear"
          onClick={() => { setFromDate(''); setToDate(''); }}
          disabled={!fromDate && !toDate}
        >
          Clear dates
        </button>
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
            <div>Action</div>
          </div>
          {filtered.map((r) => {
            const due = getDueDate(r);
            const overdue = isRequestOverdue(r, now);
            const pingedAt = r?.adminPingedAt ? new Date(r.adminPingedAt) : null;
            const hasPinged = pingedAt && !Number.isNaN(pingedAt.getTime());

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
                    className={`ping-btn ${isBookmarked(r.id) ? 'bookmarked' : ''}`}
                    onClick={() => toggleBookmark(r.id)}
                    title={isBookmarked(r.id) ? 'Remove bookmark' : 'Bookmark this request'}
                    style={{ width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Icon name="bookmark" size={16} color={isBookmarked(r.id) ? '#7b1a1a' : 'currentColor'} />
                  </button>
                  {overdue ? (
                    hasPinged ? (
                      <button className="ping-btn" disabled style={{ marginLeft: '8px' }}>
                        Pinged {formatShortDate(pingedAt)}
                      </button>
                    ) : (
                      <button
                        className="ping-btn"
                        onClick={() => {
                          if (typeof onPingAdmin === 'function') onPingAdmin(r);
                        }}
                        style={{ marginLeft: '8px' }}
                      >
                        Ping Admin
                      </button>
                    )
                  ) : (
                    <span className="req-action-muted" style={{ marginLeft: '8px' }}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackRequestsPage;
