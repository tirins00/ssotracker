import { useState } from 'react';
import Icon from '../components/Icon';

const TABS = ['All Requests', 'Pending', 'In Review', 'Processing', 'Completed', 'Rejected'];

const TrackRequestsPage = () => {
  const [activeTab, setActiveTab] = useState('All Requests');
  return (
    <div>
      <div className="page-title">Track Requests</div>
      <div className="page-sub">View and monitor all your document requests</div>
      <div className="filter-tabs">
        {TABS.map((tab) => (
          <button key={tab} className={`filter-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>
      <div className="empty-card">
        <Icon name="file" size={40} color="#ddd" />
        <p>No requests found</p>
      </div>
    </div>
  );
};

export default TrackRequestsPage;