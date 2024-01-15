import React, { useState } from 'react';
import config from '../config';

function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(config.backendUrl + '/logIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) 
      {
        const responseData = await response.json();
        const token = responseData.token;
        const user_id = responseData.user_id;
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('username', loginData.username);
        onLogin();
      }
      else 
      {
        setLoginError('Błędne dane logowania');
      }
    } catch (error) 
    {
      console.error('Błąd serwera:', error);
      setLoginError('Wystąpił błąd serwera');
    }
  };

  return (
    <div>
      <h2>Formularz logowania</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Login:
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Hasło:
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <button type="submit">Zaloguj</button>
        </div>
      </form>
      {loginError && <p>{loginError}</p>}
    </div>
  );
}

export default Login;