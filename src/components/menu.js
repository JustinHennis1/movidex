import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { signOut, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import styles from '../css/menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Menu() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showReauthForm, setShowReauthForm] = useState(false);
  const [password, setPassword] = useState('');
  const { currentUser } = useAuth();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (currentUser) {
      try {
        if (showReauthForm) {
          // Re-authenticate user
          const credential = EmailAuthProvider.credential(currentUser.email, password);
          await reauthenticateWithCredential(currentUser, credential);
        }

        // Delete user's watchlist and ratedList from Firestore
        const watchlistCollection = collection(db, 'users', currentUser.uid, 'watchlist');
        const ratedListCollection = collection(db, 'users', currentUser.uid, 'ratedList');

        const watchlistDocs = await getDocs(watchlistCollection);
        const ratedListDocs = await getDocs(ratedListCollection);

        watchlistDocs.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        ratedListDocs.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Delete user's main document
        await deleteDoc(doc(db, 'users', currentUser.uid));

        // Delete user authentication
        await deleteUser(currentUser);

        console.log('User account and data deleted');
        window.location.reload(); // Refresh the page after account deletion
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          setShowReauthForm(true);
        } else {
          console.error('Error deleting account:', error);
        }
      }
    }
  };

  const handleReauth = async (e) => {
    e.preventDefault();
    await handleDeleteAccount();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.containerfluid}>
        <ul className={styles.navbarnav}>
          <li className={styles.navitem}>
            <Link to="/" className={`${styles.navlink} ${location.pathname === "/" ? styles.active : ""}`}>
              Home
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link
              to="/watchlist"
              className={`${styles.navlink} ${location.pathname === "/watchlist" ? styles.active : ""}`}
            >
              Watchlist
            </Link>
          </li>
        </ul>

        <div className={styles.dflex}>
          {currentUser ? (
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <span className={`${styles.navlink} ${styles.userIcon}`} onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faUser} />
              </span>
              {dropdownOpen && (
                <ul className={`${styles.dropdownmenu} ${styles.show}`}>
                  <li><button className={styles.dropdownitem} onClick={handleLogout}>Logout</button></li>
                  <li><button className={styles.dropdownitem} onClick={handleDeleteAccount}>Delete Account</button></li>
                </ul>
              )}
            </div>
          ) : (
            location.pathname === '/' && (
              <Link
                to="/sign-in"
                className={`${styles.navlink} ${location.pathname === "/sign-in" ? styles.active : ""}`}
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
      {showReauthForm && (
        <div className="reauth-form">
          <form onSubmit={handleReauth}>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">Confirm</button>
          </form>
        </div>
      )}
    </nav>
  );
}

export default Menu;