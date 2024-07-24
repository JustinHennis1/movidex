import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import styles from '../css/CreateAccountCard.module.css';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const oobCode = query.get('oobCode');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Password validation logic
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 12 characters long, contain at least one uppercase letter, one number, and one special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const auth = getAuth();
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password has been reset successfully');
      navigate('/signin');
    } catch (error) {
      setError('Failed to reset password: ' + error.message);
    }
  };

  return (
    <div className={styles.createAccountContainer}>
        <div className={styles.createAccountCard}> 
      <div className={styles.title}>Reset Password</div>
      <form onSubmit={handlePasswordReset}>
        <div className={styles.inputGroup}>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {message && <div>{message}</div>}
        <button type="submit" className={styles.resetPassButton}>Reset Password</button>
      </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
