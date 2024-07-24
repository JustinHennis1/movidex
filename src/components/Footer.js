import React from 'react';
import tmdblogo from '../images/tmdblogo.svg';
import '../css/footer.css'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='logocontainer'>
        <img src={tmdblogo} alt="TMDb Logo" className='logo' />
      </div>
      <div className='linkscontainer'>
      <Link
              to="/watchlist"
              className={'link'}
            >
              View Watchlist
      </Link>
      <Link
              to="/sign-in"
              className={'link'}
            >
              Sign In
      </Link>
        <Link 
            to="/create-account" 
            className='link'
            >

          Create Account
        </Link>
      </div>
      <div className='copyright'>
        &copy; 2024 Microsoft AI Hackathon Submission. Created by Justin Hennis.
      </div>
    </footer>
  );
};

export default Footer;
