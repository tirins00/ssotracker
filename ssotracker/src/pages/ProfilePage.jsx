import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const DEFAULT_PASSWORD = '123456';

const getProfileFormData = (user = {}) => ({
  email: user?.email || '',
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
});

const ProfilePage = ({ user = {}, onUpdatePassword }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => getProfileFormData(user));
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const canEditPassword = user?.role !== undefined;
  const canEditProfile = user?.role === 'staff' || user?.role === 'student';

  useEffect(() => {
    setFormData(getProfileFormData(user));
  }, [user]);

  useEffect(() => {
    if (user?.mustChangePassword) {
      setIsEditingPassword(true);
    }
  }, [user?.mustChangePassword]);

  const handleBack = () => {
    navigate(-1);
  };

  const resetPasswordForm = () => {
    setPasswordForm({ password: '', confirmPassword: '' });
    setPasswordError('');
    if (!user?.mustChangePassword) setIsEditingPassword(false);
  };

  const resetProfileForm = () => {
    setFormData(getProfileFormData(user));
    setProfileError('');
    setIsEditingProfile(false);
  };

  const handleProfileUpdate = async () => {
    setProfileError('');
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setProfileError('First name and last name are required.');
      return;
    }

    setIsUpdating(true);
    try {
      const updated = onUpdatePassword
        ? await onUpdatePassword({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
          })
        : false;
      if (updated !== false) setIsEditingProfile(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordError('');
    if (passwordForm.password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (user?.mustChangePassword && passwordForm.password === DEFAULT_PASSWORD) {
      setPasswordError('Choose a new password instead of the initial default password.');
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsUpdating(true);
    try {
      const updated = onUpdatePassword ? await onUpdatePassword({ password: passwordForm.password }) : false;
      if (updated !== false) {
        setPasswordForm({ password: '', confirmPassword: '' });
        setIsEditingPassword(false);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <button className="back-btn" onClick={handleBack} style={{ marginBottom: '24px' }}>
        <Icon name="chevLeft" size={16} /> Back
      </button>

      <div className="page-title">My Profile</div>
      <div className="page-sub">View your profile information</div>

      <div className="profile-card">
        {user?.mustChangePassword && (
          <div className="profile-password-alert">
            Please change your initial password before continuing.
          </div>
        )}

        <div className="profile-header">
          <div className="profile-avatar">{`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'U'}</div>
          <div className="profile-header-info">
            <h2>{user?.displayName || 'User'}</h2>
            <p className="profile-role">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
              {user?.email ? ` - ${user.email}` : ''}
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-section">
            <h3>Contact Information</h3>

            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{formData.email || '-'}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">First Name</span>
              {isEditingProfile ? (
                <input
                  className="profile-input"
                  value={formData.firstName}
                  onChange={(e) => setFormData((current) => ({ ...current, firstName: e.target.value }))}
                />
              ) : (
                <span className="profile-value">{formData.firstName || '-'}</span>
              )}
            </div>

            <div className="profile-row">
              <span className="profile-label">Last Name</span>
              {isEditingProfile ? (
                <input
                  className="profile-input"
                  value={formData.lastName}
                  onChange={(e) => setFormData((current) => ({ ...current, lastName: e.target.value }))}
                />
              ) : (
                <span className="profile-value">{formData.lastName || '-'}</span>
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

        {canEditProfile && (
          <div className="profile-actions">
            {profileError && <div className="admin-crud-error">{profileError}</div>}
            {isEditingProfile ? (
              <div className="profile-password-buttons">
                <button className="btn-cancel" type="button" onClick={resetProfileForm}>
                  Cancel
                </button>
                <button className="btn-update" type="button" onClick={handleProfileUpdate} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            ) : (
              <button className="btn-edit" type="button" onClick={() => setIsEditingProfile(true)}>
                Edit Profile
              </button>
            )}
          </div>
        )}

        {canEditPassword && (
          <div className="profile-actions">
            {isEditingPassword ? (
              <div className="profile-password-form">
                <div className="profile-password-fields">
                  <input
                    className="profile-input"
                    type="password"
                    placeholder="New password"
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm((current) => ({ ...current, password: e.target.value }))}
                  />
                  <input
                    className="profile-input"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((current) => ({ ...current, confirmPassword: e.target.value }))}
                  />
                </div>
                {passwordError && <div className="admin-crud-error">{passwordError}</div>}
                <div className="profile-password-buttons">
                  {!user?.mustChangePassword && (
                    <button className="btn-cancel" type="button" onClick={resetPasswordForm}>
                      Cancel
                    </button>
                  )}
                  <button className="btn-update" type="button" onClick={handlePasswordUpdate} disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-edit" type="button" onClick={() => setIsEditingPassword(true)}>
                Edit Password
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
