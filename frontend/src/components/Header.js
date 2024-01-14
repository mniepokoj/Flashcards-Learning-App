import React, { useState } from 'react';
import Login from './Login';
import './styles.css';

function Header({ isLogged, onLogin, onLogout }) {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };


  return (
    <header>
      {isLogged ? (
        <>
          <button className="loginButton" onClick={onLogout}>Wyloguj</button>
        </>
      ) : (
        <button className="loginButton" onClick={toggleLoginForm}>Zaloguj</button>
      )}
      {showLoginForm && !isLogged && <Login onLogin={onLogin} />}
    </header>
  );
}

export default Header;