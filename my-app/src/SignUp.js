import './App.css';
import { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const goToLogin = () => {
    window.location.href = "/login";
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('Minimum 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('At least one capital letter');
    if (!/[a-z]/.test(password)) errors.push('At least one lowercase');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('At least one special character');
    return errors.length > 0 ? errors.join(', ') : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordError(validatePassword(value));
    }

    if (name === 'confirmPassword') {
      setConfirmPasswordError(value !== formData.password ? 'Passwords do not match' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordErr = validatePassword(formData.password);
    if (passwordErr) {
      setPasswordError(passwordErr);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      alert('Please complete all required fields');
      return;
    }

    try {
      const registerResponse = await fetch('http://localhost:5000/api/v1/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        console.error('Error during registration:', error);
        throw new Error('Error during registration');
      }

      goToLogin();

    } catch (error) {
      console.error('Error during the proces:', error);
      alert('There was a problem during registration. Please check your details and try again.');
    }
  };

  return (
    <div className='container-div'>
      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" onChange={handleChange} required />
          </label>
          {passwordError && <p className="error">{passwordError}</p>}
          <label>
            Confirm Password:
            <input type="password" name="confirmPassword" onChange={handleChange} required />
          </label>
          {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}

          <button className="button" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
