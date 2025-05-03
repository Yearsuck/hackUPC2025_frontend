import './App.css';
import { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Both fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const result = await response.json();
      console.log('Logged in:', result);

      // Guardar el token en las cookies
      document.cookie = `auth_token=${result.token}; path=/; secure; samesite=strict`;

      // Redirigir al menú
      window.location.href = '/Menu';
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={handleChange} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
