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
  const [groups, setGroups] = useState([
    // { name: "prueba1", code: "1234", pendingUsers: ["alex"] }, { name: "prueba1", code: "1234" }, { name: "prueba1", code: "1234" }, { name: "prueba1", code: "1234" }, { name: "prueba1", code: "1234" }, { name: "prueba1", code: "1234" }, { name: "prueba1", code: "1234" }, { name: "prueba1", code: "1234" }
  ]);

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
      console.warn('Token not found, redirecting to Login...');
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
        throw new Error(`Error fetching user: ${userRes.status}`);
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
        console.warn('Profile image not found, using default image.');
        setProfilePictureURL('/default_image.jpeg');
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
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
    let { name, value } = e.target;
    if (name === 'deadline') {
      const date = new Date(value);
      value = date.toISOString();
    }
    setCreateData({ ...createData, [name]: value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('auth_token');

    try {
      const response = await fetch('http://localhost:5000/api/v1/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createData),
      });

      setShowCreateModal(false);
      navigate("../InterestsForm", { state: await response.json() });

    } catch (err) {
      console.error('Create group failed:', err);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('auth_token');
    try {
      const response = await fetch('http://localhost:5000/api/v1/group/enter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: joinCode }),
      });
      setShowJoinModal(false);
      navigate("../InterestsForm", { state: response.json() });

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
          <p className='menu-p'>Create your travel group and start planning your adventure!</p>

          <div className="group-container">
            <div className='group-list'>
              {groups.length ?
                groups.length && groups.map((group) => {
                  return (
                    <div className='groupDiv' onClick={() => { navigate("../End", { state: group }) }}>
                      <p>Name: {group.name}</p>
                      <p>Code: {group.code}</p>
                    </div>
                  )
                })
                :
                (<p className='no-group'>No groups found yet. Click 'Create Group' to start your own, or 'Join Group'
                 if a friend already created one—just ask them for the code ;)</p>)
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
