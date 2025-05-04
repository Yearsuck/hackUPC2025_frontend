import { useLocation } from 'react-router-dom';
import './App.css';

function End() {
    const { state } = useLocation();
    console.log(state);

    return (
        <div className="end-page">
            {state.response ? (
                <div className="result-container">
                    {/* <h1 className="destination-title">{destination.place ?? "hola"}</h1> */}
                    <p className="destination-description">{state.response}</p>
                </div>
            ) : (
                <div className="waiting-message">
                    <div className="division-party">
                        <div className="division-party-image">
                            {(
                                <details className="pending-users-dropdown">
                                    <summary>Pending users</summary>
                                    <ul>
                                        {state.users.map((user, index) => ( //puede que no sea users
                                            <li className={index? 'greenUser':'redUser'}>{user}</li>
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