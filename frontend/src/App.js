import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Pokedex from './components/Pokedex';
import PcBox from './components/PcBox';
import TrainerCard from './components/TrainerCard';
import PokemonDetails from './components/PokemonDetails';
import NavigationButtons from './components/NavigationButtons';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/pc-box" element={<PcBox />} />
        <Route path="/trainer-card" element={<TrainerCard />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} /> {/* Route pour les détails */}
        <Route path="*" element={<Navigate to="/pokedex" />} />
      </Routes>
      <NavigationButtons />
    </div>
  );
}

export default App;
