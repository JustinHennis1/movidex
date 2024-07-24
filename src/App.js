// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/menu';
import Home from './components/Home';
import { SessionProvider } from './components/SessionContext';
import Watchlist from './components/Watchlist';
import Footer from './components/Footer';
import SignInCard from './components/SignIn';
import CreateAccountCard from './components/CreateAcc';
import { AuthProvider } from './components/AuthContext';
import ResetPasswordPage from './components/ResetPasswordPage';

function App() {

  return (
    <Router>
       <AuthProvider>
          <SessionProvider>
            <div style={{ backgroundColor: '#111' }}>
              <Menu />
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/sign-in" element={<SignInCard />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/create-account" element={<CreateAccountCard />} />
              </Routes>
             
            </div>
            <Footer />
          </SessionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
