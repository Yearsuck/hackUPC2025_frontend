import React, { useState } from 'react';
import './App.css';

function EditProfile() {
  const [picture, setPicture] = useState(null);
  const [imageError, setImageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

    if (file && !allowedTypes.includes(file.type)) {
      setImageError('Only PNG, JPG, JPEG or GIF files are allowed.');
      setPicture(null);
    } else {
      setImageError('');
      setPicture(file);
    }
  };

  const getTokenFromCookies = () => {
    const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
    return match ? match[2] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!picture) {
      setImageError('Please select an image to upload.');
      return;
    }

    const token = getTokenFromCookies();
    if (!token) {
      alert('You must be logged in to update your profile picture.');
      return;
    }

    const formData = new FormData();
    formData.append('picture', picture);

    try {
      const response = await fetch('http://localhost:5000/api/v1/user/profile_picture', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload error:', error);
        throw new Error('Failed to upload image.');
      }

      setSuccessMessage('Profile picture updated successfully!');
      setPicture(null);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('There was an error updating your profile picture. Try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Choose Profile Picture:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {imageError && <p className="error">{imageError}</p>}
        <button type="submit" className="button">Upload</button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
      <button className="button" onClick={() => window.location.href = '/Menu'}>Back to menu</button>
    </div>
  );
}

export default EditProfile;
