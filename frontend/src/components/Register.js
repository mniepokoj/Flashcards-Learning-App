import React, { useState } from 'react';
import config from '../config';

function Register({ onLogin }) {
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [registerError, setRegisterError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (registerData.username.length < 4 || registerData.password.length < 4) {
        setRegisterError('Nazwa użytkownika i hasło muszą mieć co najmniej 4 znaki.');
        return;
      }
    try {
      const response = await fetch(config.backendUrl + '/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) 
      {
        const responseData = await response.json();
        const token = responseData.token;
        const user_id = responseData.user_id;
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('username', registerData.username);
        onLogin();
      }
      else if(response.status === 409) 
      {
        setRegisterError('Podany login już istnieje');
      }
      else 
      {
        setRegisterError('Wystąpił błąd rejestracji');
      }
    } catch (error) 
    {
      setRegisterError('Wystąpił błąd serwera:' + error);
    }
  };

  return (
    <div>
      <h2>Formularz rejestracji</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Login:
            <input
              type="text"
              name="username"
              value={registerData.username}
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
              value={registerData.password}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <button type="submit">Zarejestruj</button>
        </div>
      </form>
      {registerError && <p>{registerError}</p>}
    </div>
  );
}

export default Register;