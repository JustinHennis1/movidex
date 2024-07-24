import React, { useState } from 'react';
import styles from '../css/CreateAccountCard.module.css';
import { useNavigate } from 'react-router-dom';
import { signupWithEmailPassword } from '../auth_signup';
import {Link} from 'react-router-dom';

const CreateAccountCard = ({ onCreateAccount }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // State variable to hold error messages
    const navigate = useNavigate();
  
    const handleCreateAccount = async (e) => {
      e.preventDefault();
      setError('');
      
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/;
      // Check if email is already in use
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    
      if (password.length < 12) {
        setError('Password must exceed 12 characters in length');
        return;
      }
    
      if (!passwordRegex.test(password)) {
        setError('Password must contain at least one capital letter, one number, and one special character');
        return;
      }
    
      try {
        const user = await signupWithEmailPassword(email, password);
        console.log('User created:', user);
        navigate('/');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setError('Email is already in use. Please use a different email address.');
        } else {
          console.error('Account creation failed:', error.message);
          setError('An error occurred during account creation. Please try again.');
        }
        return;
      }
    };
    
  
    return (
      <div className={styles.createAccountContainer}>
        <div className={styles.createAccountCard}>
        <div className={styles.title}>Create Account</div>
          <form onSubmit={handleCreateAccount}>
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
            <nav>
                            <span style={{padding:'10px'}}>Already Have an Account? </span>
                            
                            <Link className={styles.link} to="/sign-in">Sign In</Link>
                            
            </nav>
            <br/>
            <button type="submit" className={styles.createAccountButton}>Create Account</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default CreateAccountCard;
