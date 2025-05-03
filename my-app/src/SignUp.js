import './App.css';
import { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', // Nuevo estado para confirmar la contraseña
    profilePicture: null,
  });
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // Error para confirmar contraseña

  const goToURL = () => {
    window.location.href = "/HowToLog";
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
    const { name, value, files } = e.target;

    if (name === 'profilePicture') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === 'password') {
        setPasswordError(validatePassword(value));
      }

      if (name === 'confirmPassword') {
        if (value !== formData.password) {
          setConfirmPasswordError('Passwords do not match');
        } else {
          setConfirmPasswordError('');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseñas
    const passwordErr = validatePassword(formData.password);
    if (passwordErr) {
      setPasswordError(passwordErr);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch('https://tu-api.com/signup', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      console.log('Registrado:', result);
      goToURL(); // Redirige si todo salió bien
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" onChange={handleChange} required />
          </label>
          <label>
            Electronic address:
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

          <label>
            Profile photo:
            <input type="file" name="profilePicture" accept="image/*" onChange={handleChange} />
          </label>

          <button className="button" type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
