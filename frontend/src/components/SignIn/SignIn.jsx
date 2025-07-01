import React, { useState, useContext } from 'react';
import './SignIn.css';
import { StoreContext } from '../../context/StoreContext';

const SignIn = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState('request'); // request | verify | reset
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(StoreContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      if (isSignUp) {
        if (!form.username || !form.email || !form.password) {
          setSuccessMessage('All fields are required for registration.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setLoading(false);

        if (res.ok) {
          setSuccessMessage('Account created successfully! Please sign in.');
          setIsSignUp(false);
          setForm({ email: '', username: '', password: '' });
        } else {
          setSuccessMessage(data.message || 'Signup failed.');
        }
      } else if (isForgotPassword) {
        if (forgotStep === 'request') {
          if (!resetIdentifier) {
            setSuccessMessage('Please enter your email or username.');
            setLoading(false);
            return;
          }
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: resetIdentifier }),
          });
          const data = await res.json();
          setLoading(false);

          if (res.ok) {
            setSuccessMessage('Reset code sent to your email.');
            setForgotStep('verify');
          } else {
            setSuccessMessage(data.message || 'Failed to send reset code.');
          }
        } else if (forgotStep === 'verify') {
          if (!resetCode) {
            setSuccessMessage('Enter the reset code you received.');
            setLoading(false);
            return;
          }
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-reset-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: resetIdentifier,
              code: resetCode,
            }),
          });
          const data = await res.json();
          setLoading(false);

          if (res.ok) {
            setSuccessMessage('Code verified! Set your new password.');
            setForgotStep('reset');
          } else {
            setSuccessMessage(data.message || 'Invalid or expired code.');
          }
        } else if (forgotStep === 'reset') {
          if (!newPassword) {
            setSuccessMessage('Enter a new password.');
            setLoading(false);
            return;
          }
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: resetIdentifier,
              newPassword: newPassword,
            }),
          });
          const data = await res.json();
          setLoading(false);

          if (res.ok) {
            setSuccessMessage('Password reset successful! Please sign in.');
            setIsForgotPassword(false);
            setForgotStep('request');
            setResetIdentifier('');
            setResetCode('');
            setNewPassword('');
          } else {
            setSuccessMessage(data.message || 'Password reset failed.');
          }
        }
      } else {
        if (!form.username || !form.password) {
          setSuccessMessage('Username and password are required.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });
        const data = await res.json();
        setLoading(false);

        if (res.ok) {
          setSuccessMessage(`Welcome back, ${data.user.username}!`);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          setIsLoggedIn(true);
          setForm({ email: '', username: '', password: '' });
        } else {
          setSuccessMessage(data.message || 'Login failed.');
        }
      }
    } catch (err) {
      console.error(err);
      setSuccessMessage('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="signin-overlay">
      <div className="signin-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>
          {isForgotPassword
            ? forgotStep === 'request'
              ? 'Forgot Password'
              : forgotStep === 'verify'
              ? 'Verify Reset Code'
              : 'Set New Password'
            : isSignUp
            ? 'Create Account'
            : 'Sign In'}
        </h2>

        {isLoggedIn ? (
          <div className="logged-in-message">
            <h3>{successMessage}</h3>
            <button onClick={onClose}>Continue</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {isForgotPassword ? (
              <>
                {forgotStep === 'request' && (
                  <>
                    <input
                      type="text"
                      placeholder="Email or Username"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={loading}>Send Reset Code</button>
                  </>
                )}
                {forgotStep === 'verify' && (
                  <>
                    <input
                      type="text"
                      placeholder="Enter Reset Code"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={loading}>Verify Code</button>
                  </>
                )}
                {forgotStep === 'reset' && (
                  <>
                    <input
                      type="password"
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={loading}>Reset Password</button>
                  </>
                )}
              </>
            ) : (
              <>
                {isSignUp && (
                  <>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </>
                )}
                {!isSignUp && (
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                )}
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Please wait...' : isSignUp ? 'Register' : 'Sign In'}
                </button>
              </>
            )}
          </form>
        )}

        {successMessage && <p className="success-message">{successMessage}</p>}

        {!isForgotPassword && !isSignUp && !isLoggedIn && (
          <p className="forgot-password" onClick={() => {
            setIsForgotPassword(true);
            setSuccessMessage('');
          }}>
            Forgot Password?
          </p>
        )}

        {!isForgotPassword && !isLoggedIn && (
          <p className="toggle-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <span onClick={() => {
              setIsSignUp(!isSignUp);
              setSuccessMessage('');
            }}>
              {isSignUp ? ' Sign In' : ' Create one'}
            </span>
          </p>
        )}

        {isForgotPassword && !isLoggedIn && (
          <p className="toggle-text">
            Remembered your password?{' '}
            <span onClick={() => {
              setIsForgotPassword(false);
              setForgotStep('request');
              setSuccessMessage('');
            }}>
              Back to Sign In
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignIn;
