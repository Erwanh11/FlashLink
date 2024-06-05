// src/components/Matches.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import '../App.css';

const Matches = () => {
  const { userId } = useUser();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const res = await axios.get(`http://localhost:5001/api/matches/${userId}`); // Assurez-vous que le port est correct
      setMatches(res.data);
    };

    fetchMatches();
  }, [userId]);

  return (
    <div>
      <h1>Matches</h1>
      <ul>
        {matches.map((match) => (
          <li key={match._id}>
            {match.user1.name} and {match.user2.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Matches;
