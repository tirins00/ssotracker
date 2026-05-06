import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const ProfilePage = ({ user = {}, onUpdateProfile }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  useEffect(() => {
    setFormData({
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    });
  }, [user]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(formData);
      }
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <button className="back-btn" onClick={handleBack} style={{ marginBottom: '24px' }}>
        <Icon name="chevLeft" size={16} /> Back
      </button>

      <div className="page-title">My Profile</div>
      <div className="page-sub">View your profile information</div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'U'}</div>
          <div className="profile-header-info">
            <h2>{user?.displayName || 'User'}</h2>
            <p className="profile-role">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
              {user?.email ? ` · ${user.email}` : ''}
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-section">
            <h3>Contact Information</h3>
            
            {/* Email Field */}
            <div className="profile-row">
              <span className="profile-label">Email</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span className="profile-value">{formData.email || '—'}</span>
              )}
            </div>

            {/* First Name Field */}
            <div className="profile-row">
              <span className="profile-label">First Name</span>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span className="profile-value">{formData.firstName || '—'}</span>
              )}
            </div>

            {/* Last Name Field */}
            <div className="profile-row">
              <span className="profile-label">Last Name</span>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span className="profile-value">{formData.lastName || '—'}</span>
              )}
            </div>

            {user?.position && (
              <div className="profile-row">
                <span className="profile-label">Position</span>
                <span className="profile-value">{user.position}</span>
              </div>
            )}
          </div>

          {user?.adminId && (
            <div className="profile-section">
              <h3>Account Details</h3>
              <div className="profile-row">
                <span className="profile-label">Admin ID</span>
                <span className="profile-value">{user.adminId}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Status</span>
                <span className={`status-badge ${user?.active ? 'status-active' : 'status-inactive'}`}>
                  {user?.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-update" onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
