import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function Menu() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createData, setCreateData] = useState({
    name: '',
    description: '',
    deadline: '',
  });
  const [joinCode, setJoinCode] = useState('');
  const [username, setUsername] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState('/default_image.jpeg');
  const [groups, setGroups] = useState([{name: "prueba1", code: "1234"}, {name: "prueba1", code: "1234"}, {name: "prueba1", code: "1234"}, {name: "prueba1", code: "1234"}, {name: "prueba1", code: "1234"}, {name: "prueba1", code: "1234"}, {name: "prueba1", code: "1234"}, {name: "prueba1", code: "1234"}]);

  const navigate = useNavigate();

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
      fetchGroups(token);
    } else {
      console.warn('Token no encontrado, redirigiendo a Login...');
      window.location.href = '/Login';
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
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

  const fetchGroups = async (token) => {
    fetch('http://localhost:5000/api/group', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then((rawData) => rawData)
      .then((jsonData) => setGroups(jsonData.json()))
      .catch((err) => console.error("Error: ", err));
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData({ ...createData, [name]: value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('auth_token');
    try {
      await fetch('http://localhost:5000/api/v1/group', {
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
      await fetch('http://localhost:5000/api/v1/group/enter', {
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

  const hoverImage = (isHovered) => {
    const profilePic = document.querySelector('.profile-pic');
    if (isHovered) {
      profilePic.style.transform = 'scale(1.1)';
    } else {
      profilePic.style.transform = 'scale(1)';
    }
  }

  return (
    <div className='container-menu'>
      <div className='white-container'>
        <div className="top-right">
          <span className="username">{username}</span>
          <img
            src={profilePictureURL}
            alt="Profile"
            className="profile-pic"
            onMouseEnter={() => hoverImage(true)}
            onMouseLeave={() => hoverImage(false)}
            onClick={() => window.location.href = '/EditProfile'}
          />
        </div>

        <div>
          <h1 className='menu-title'>LucidRoutes - Menu</h1>
          <p className='menu-p'>¡Crea tu grupo de viaje y comienza a planificar tu aventura!</p>

          <div className="group-container">
            <div className='group-list'>
              {groups.length ?
                groups.length && groups.map((group) => {
                  return (
                    <div className='groupDiv' onClick={()=>{}}>
                      <p>Name: {group.name}</p>
                      <p>Code: {group.code}</p>
                    </div>
                  )
                })
                :
                (<p className='no-group'>There isn't any group yet.
                  Click on "Create group" button to create your own group
                  or "Join group" if any friend has created it an ask him for the code.</p>)
              }
            </div>

            <div className="group-actions">
              <button className='button-menu' onClick={() => setShowCreateModal(true)}>Create Group</button>
              <button className='button-menu' onClick={() => setShowJoinModal(true)}>Join Group</button>
            </div>
          </div>
          {showCreateModal && (
            <div className="modal">
              <form className="modal-content" onSubmit={handleCreateSubmit}>
                <h2>Create Group</h2>
                <label>
                  Group Name:
                  <input type="text" name="name" onChange={handleCreateChange} required />
                </label>
                <label>
                  Description:
                  <textarea name="description" onChange={handleCreateChange} required />
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
      </div>
    </div>
  );
}

export default Menu;