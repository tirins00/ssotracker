import { useState } from 'react';
import Icon from '../components/Icon';

const LoginPage = ({ onLogin }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [role,     setRole]     = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) onLogin(email.trim(), role);
  };

  return (
    <div className="login-page">
      {/* Hero Panel */}
      <div className="login-hero">
        <img
          className="login-hero-img"
          src="https://picsum.photos/seed/citucampus/900/1200"
          alt="CIT-U Campus"
          width={900}
          height={1200}
          loading="lazy"
        />
        <div className="login-hero-content">
          <div className="hero-logo">
            <div className="hero-logo-icon">
              <Icon name="cap" size={22} color="#1a0000" />
            </div>
            <div className="hero-logo-text">
              <div className="name">CIT-U</div>
              <div className="sub">Cebu Institute of Technology – University</div>
            </div>
          </div>
          <div className="hero-heading">Student Success<br />Office</div>
          <div className="hero-accent">Request Tracker System</div>
          <div className="hero-sub">
            Submit, track, and manage your document requests from the SSO — anytime, anywhere.
          </div>
        </div>
        <div className="hero-stats">
          {[
            ['500+',     'Requests Processed'],
            ['< 3 days', 'Avg. Processing'   ],
            ['98%',      'Satisfaction Rate' ],
          ].map(([num, lbl]) => (
            <div className="hero-stat" key={lbl}>
              <div className="num">{num}</div>
              <div className="lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Panel */}
      <div className="login-form-side">
        <div className="login-form-box">
          <div className="login-title">Welcome back</div>
          <div className="login-subtitle">Sign in to access your SSO account</div>
          <div className="form-field">
            <label>I am a:</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              {[
                { value: 'student', label: 'Student' },
                { value: 'staff', label: 'Staff' },
                { value: 'admin', label: 'Admin' },
              ].map((opt) => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13.5px' }}>
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="your.email@cit.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <div className="pw-wrap">
                <input
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPw ? 'eyeOff' : 'eye'} size={17} />
                </button>
              </div>
            </div>
            <button type="submit" className="signin-btn">
              Sign In <Icon name="chevRight" size={17} color="#fff" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
