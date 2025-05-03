import './App.css';
import { useState, useEffect } from 'react';

function Menu() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createData, setCreateData] = useState({
    groupName: '',
    description: '',
    invitedUsers: [],
  });
  const [joinCode, setJoinCode] = useState('');
  const [username, setUsername] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState('/default_image.jpeg');

  const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  };

  useEffect(() => {
    const token = getCookie('auth_token');
    console.log("Token:", token);

    if (token) {
      fetchUserData(token);
    } else {
      console.warn('Token no encontrado, redirigiendo a Login...');
      window.location.href = '/Login';
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      // Obtener el usuario
      const userRes = await fetch('http://localhost:5000/api/v1/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userRes.ok) {
        throw new Error(`Error al obtener usuario: ${userRes.status}`);
      }

      const user = await userRes.json();
      setUsername(user.username);

      // Obtener la foto de perfil
      const picRes = await fetch('http://localhost:5000/api/v1/user/profile_picture', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (picRes.ok && picRes.headers.get('Content-Type')?.startsWith('image')) {
        const blob = await picRes.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfilePictureURL(imageUrl);
      } else {
        console.warn('No se encontró imagen de perfil, usando imagen por defecto');
        setProfilePictureURL('/default_image.jpeg');
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'invitedUsers') {
      const usersArray = value.split(',').map((user) => user.trim());
      setCreateData({ ...createData, [name]: usersArray });
    } else {
      setCreateData({ ...createData, [name]: value });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('auth_token');
    try {
      await fetch('http://localhost:5000/api/v1/group/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createData),
      });
      setShowCreateModal(false);
    } catch (err) {
      console.error('Create group failed:', err);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('auth_token');
    try {
      await fetch('http://localhost:5000/api/v1/group/join', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: joinCode }),
      });
      setShowJoinModal(false);
    } catch (err) {
      console.error('Join group failed:', err);
    }
  };

  const hovered = (isHovered) => {
    const profilePic = document.querySelector('.profile-pic');
    if (isHovered) {
      profilePic.style.transform = 'scale(1.1)';
    } else {
      profilePic.style.transform = 'scale(1)';
    }
  }

  return (
    <div className="menu-page">
      <div className="top-right">
        <span className="username">{username}</span>
        <img
          src={profilePictureURL}
          alt="Profile"
          className="profile-pic"
          onMouseEnter={() => hovered(true)}
          onMouseLeave={() => hovered(false)}
          onClick={() => window.location.href = '/EditProfile'}
        />
      </div>

      <div className="menu-container">
        <div className="group-list">
          <div className="marquee">
            <button className="group-item">Group 1</button>
            <button className="group-item">Group 2</button>
            <button className="group-item">Group 3</button>
          </div>
        </div>

        <div className="group-actions">
          <button className="menu-button" onClick={() => setShowCreateModal(true)}>Create Group</button>
          <button className="menu-button" onClick={() => setShowJoinModal(true)}>Join Group</button>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleCreateSubmit}>
            <h2>Create Group</h2>
            <label>
              Group Name:
              <input type="text" name="groupName" onChange={handleCreateChange} required />
            </label>
            <label>
              Description:
              <textarea name="description" onChange={handleCreateChange} required />
            </label>
            <label>
              Invite Users (comma separated usernames):
              <input type="text" name="invitedUsers" onChange={handleCreateChange} />
            </label>
            <label>
              Deadline:
              <input type="date" name="deadline" className='deadline' onChange={handleCreateChange} required />
            </label>
            <div className="modal-actions">
              <button type="submit" className="button">Submit</button>
              <button type="button" className="red_button" onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showJoinModal && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleJoinSubmit}>
            <h2>Join Group</h2>
            <label>
              Group Code:
              <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} required />
            </label>
            <div className="modal-actions">
              <button type="submit" className="button">Join</button>
              <button type="button" className="red_button" onClick={() => setShowJoinModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Menu;
