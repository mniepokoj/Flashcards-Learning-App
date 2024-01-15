import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './styles.css';

function Header({ isLogged, onLogin, onLogout }) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowRegisterForm(false); // Upewnij się, że formularz rejestracji jest ukryty po kliknięciu przycisku "Zaloguj"
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
    setShowLoginForm(false); // Upewnij się, że formularz logowania jest ukryty po kliknięciu przycisku "Zarejestruj"
  };

  return (
    <header>
      {isLogged ? (
        <>
          <button className="loginButton" onClick={onLogout}>Wyloguj</button>
        </>
      ) : 
      (
        <>
          <button className="loginButton" onClick={toggleLoginForm}>Zaloguj</button>
          <button className="loginButton" onClick={toggleRegisterForm}>Zarejestruj</button>
          {showLoginForm && <Login onLogin={onLogin} />}
          {showRegisterForm && <Register onLogin={onLogin}/>}
        </>
      )}
    </header>
  );
}

export default Header;
