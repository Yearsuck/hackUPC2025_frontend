import './TripResult.css';
import { useState, useEffect } from 'react';

function TripResult() {
  const [participants, setParticipants] = useState([]);
  const [finalPlace, setFinalPlace] = useState('Barcelona');
  const [description, setDescription] = useState('Generant descripció amb IA...');

  useEffect(() => {
    // Simulació: Crida a la API per obtenir participants i descripció generada per IA
    setParticipants(['Joan', 'Maria', 'Pau', 'Laia']);
    setTimeout(() => {
      setDescription(
        'Barcelona és una ciutat vibrant amb una arquitectura modernista impressionant, una escena gastronòmica de classe mundial i una rica història mediterrània.'
      );
    }, 1000);
  }, []);

  return (
    <div className="trip-result-container">
      <div className="left-panel">
        <h2>Participants</h2>
        <ul>
          {participants.map((p, index) => (
            <li key={index}>{p}</li>
          ))}
        </ul>
      </div>
      <div className="right-panel">
        <h1>{finalPlace}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default TripResult;
