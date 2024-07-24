import React, { useState } from 'react';
import styles from '../css/signincard.module.css';
import { loginWithEmailPassword, resetPassword } from '../auth_loginwpass'; // Import resetPassword
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignInCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State variable to hold error messages
  const [message, setMessage] = useState(''); // State variable to hold success messages
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error message
    setMessage(''); // Clear any previous success message
    try {
      await loginWithEmailPassword(email, password);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password'); // Set error message on failure
      //setEmail('');
      setPassword('');
    }
  };

  const handlePasswordReset = async () => {
    setError(''); // Clear any previous error message
    setMessage(''); // Clear any previous success message
    try {
      if(!email){
        setError('Please enter your email');
        return;
      }
      const response = await resetPassword(email);
      setMessage(response);
    } catch (error) {
      if(error.message === 'Firebase: Error (auth/invalid-email).')
      setError('Please enter a valid email address');
    }
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.signInCard}>
        <div className={styles.title}>Sign In</div>
        <form onSubmit={handleSignIn}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {message && <div className={styles.successMessage}>{message}</div>}
          <div>
            <button type="button" onClick={handlePasswordReset} className={styles.resetPasswordButton}>
              Forgot Password?
            </button>
          </div>
          <nav>
            <span style={{ padding: '10px' }}>Don't Have an Account?</span>
            <Link className={styles.link} to="/create-account">Create Account</Link>
          </nav>
          <br />
          <button type="submit" className={styles.signInButton}>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignInCard;
