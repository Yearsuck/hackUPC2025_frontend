import './App.css';
import { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const goToURL = () => {
    window.location.href = "/Menu";
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

    // Paso 1: Enviar datos de usuario (username, email, password)
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const userResponse = await fetch('http://localhost:5000/api/v1/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const userResult = await userResponse.json();
      console.log('Usuario registrado:', userResult);

      // Paso 2: Enviar foto de perfil si existe
      if (formData.profilePicture) {
        const formDataPicture = new FormData();
        formDataPicture.append('profilePicture', formData.profilePicture);

        // Recuperar el token de la cookie
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (token) {
          const pictureResponse = await fetch('http://localhost:5000/api/v1/user/profile_picture/', {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,  // Enviar el token en el header
            },
            body: formDataPicture,
          });

          const pictureResult = await pictureResponse.json();
          console.log('Foto de perfil cargada:', pictureResult);
        } else {
          console.error('No se encontró el token de autenticación.');
        }
      }

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

          <button className="button" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
