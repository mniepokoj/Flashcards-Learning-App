import React, { useState } from 'react';

function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Wyślij dane na serwer - tutaj możesz dodać odpowiednią logikę obsługi logowania
    try {
      const response = await fetch('http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) 
      {
        const authToken = response.headers.get('AuthToken');
        const warehouse = await response.json();
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('warehouseId', warehouse.id);
        localStorage.setItem('warehouseName', warehouse.name);
        console.log("zalogowano");
        onLogin();
      } 
      else 
      {
        // Błąd logowania - wyświetl komunikat
        setLoginError('Błędne dane logowania');
      }
    } catch (error) {
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