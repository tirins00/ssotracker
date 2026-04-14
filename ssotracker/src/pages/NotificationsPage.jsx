import Icon from '../components/Icon';

const NotificationsPage = () => (
  <div>
    <div className="page-title">Notifications</div>
    <div className="page-sub">Stay updated on your request status</div>
    <div className="notif-empty">
      <Icon name="bell" size={44} color="#ddd" />
      <p>No notifications</p>
    </div>
  </div>
);

export default NotificationsPage;