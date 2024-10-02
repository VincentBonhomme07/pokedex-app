import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons">
      <button onClick={() => navigate('/pokedex')}>Pokédex</button>
      <button onClick={() => navigate('/pc-box')}>Boîte PC</button>
      <button onClick={() => navigate('/trainer-card')}>Carte Dresseur</button>
    </div>
  );
};

export default NavigationButtons;
