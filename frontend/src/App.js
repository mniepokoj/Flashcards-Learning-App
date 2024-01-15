import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import config from './config';
import HomePage from './components/HomePage';
import Footer from './components/Footer'

function App() {
  const [isLogged, setIsLogged] = useState(false);

  const handleLogin = () => {
    setIsLogged(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      const checkLoginStatus = async () => {
        try {
          const response = await fetch(config.backendUrl + '/isLoggedIn', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          });

          return response.ok;
        } catch (error) {
          console.error('Błąd podczas sprawdzania statusu logowania:', error);
          return false;
        }
      };

      let isLoggedIn = false;
      if (token != null) {
        if (await checkLoginStatus()) {
          isLoggedIn = true;
        } else {
          localStorage.removeItem('token');
        }
      }

      setIsLogged(isLoggedIn);
    };
    fetchData();
  }, []);

  return (
    <Router>
      <Header isLogged={isLogged} onLogin={handleLogin} onLogout={handleLogout} />
      <Routes>
        {isLogged ? (
          <Route path="/" element={<HomePage />} />
        ) : 
        (
          <Route path="/" element={<div/>} />
        )}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
