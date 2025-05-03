// End.jsx
import { useLocation } from 'react-router-dom';
import './App.css';

function End() {
    const { state } = useLocation();
    console.log(state);

    //TODO modificar endpoint
    const destinationData = () => {
        if (state.pendingUsers.length) {
            fetch('http://localhost:5000/api/v1/group/destination', {
                method: 'GET',
                headers: {
                    // 'Authorization': `Bearer ${getCookie('auth_token')}`,
                },
            });
        }
    }

    const destination = destinationData();

    return (
        <div className="end-page">
            {destination ? (
                <div className="result-container">
                    <h1 className="destination-title">{destination.place?? "hola"}</h1>
                    <p className="destination-description">{destination.description}</p>
                </div>
            ) : (
                <div className="waiting-message">
                    <div className="division-party">
                        <div className="division-party-image">
                            {(
                                <details className="pending-users-dropdown">
                                    <summary>Pending users</summary>
                                    <ul>
                                        {state.pendingUsers.map((user, index) => (
                                            <li key={index}>{user}</li>
                                        ))}
                                    </ul>
                                </details>
                            )}
                        </div>
                        <div className="division-party-text">
                            <h1>Some group members haven't responded yet.</h1>
                            <p>Please wait for everyone to complete their choices.</p>
                            <button className="button" onClick={() => window.location.href = "/Menu"}>
                                Back to Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default End;
