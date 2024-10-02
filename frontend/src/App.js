import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Pokedex from './components/Pokedex';
import PcBox from './components/PcBox';
import TrainerCard from './components/TrainerCard';
import NavigationButtons from './components/NavigationButtons';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Routes encapsulées dans Routes */}
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pc-box" element={<PcBox />} />
          <Route path="/trainer-card" element={<TrainerCard />} />
          {/* Redirection pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/pokedex" />} />
        </Routes>
        <NavigationButtons />
      </div>
    </Router>
  );
}

export default App;

