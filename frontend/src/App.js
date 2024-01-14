import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import config from './config';
import HomePage from './components/HomePage';
import Login from './components/Login';

function App() 
{
  const [isLogged, setIsLogged] = useState(false);

  const handleLogin = () => {
    setIsLogged(true);
  };

  const handleLogout = () => 
  {
    localStorage.removeItem('authToken');
    setIsLogged(false);
  };

  useEffect(() => 
  {
    //const token = localStorage.getItem('token');
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDUyNjEyMDksImV4cCI6MTcwNTM0NzYwOX0.EVEfJ01gKSmr4WaKg4s3s_J9JpNTsNB6oOLy6W-O_Fs"
    const checkLoginStatus = async () => 
    {
      try 
      {     
        console.log(1)   
        const response = await fetch(config.backendUrl + '/isLoggedIn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        console.log(2);   
        return response.ok;
      } catch (error) 
      {
        console.error('Błąd podczas sprawdzania statusu logowania:', error);
        return false;
      }
    };

    console.log(3);
    let isLoggedIn = false;

    if(token != null)
    {
      if(checkLoginStatus)
      {
        isLoggedIn = true;
      }
      else
      {
        localStorage.removeItem('token');
      }
    }

    console.log(isLoggedIn);
    setIsLogged(isLoggedIn);
  }, []);

  return (
    <Router>
      <Header isLogged={isLogged} onLogin={handleLogin} onLogout={handleLogout} />
      <Routes>

      </Routes>
    </Router>
  );
}

export default App;