// src/components/Pokedex.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Pokedex.css';

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [capturedPokemon, setCapturedPokemon] = useState([]);
  const [seenPokemon, setSeenPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook pour la navigation

  const fetchPokemonDetails = async (pokemon, index) => {
    try {
      const response = await axios.get(pokemon.url.replace('pokemon', 'pokemon-species'));
      const speciesData = response.data;

      const nameInFrench = speciesData.names.find(
        (nameEntry) => nameEntry.language.name === 'fr'
      );

      const pokemonResponse = await axios.get(pokemon.url);
      const typesInFrench = await Promise.all(
        pokemonResponse.data.types.map(async (typeEntry) => {
          const typeResponse = await axios.get(typeEntry.type.url);
          const typeName = typeResponse.data.names.find(
            (nameEntry) => nameEntry.language.name === 'fr'
          );
          return typeName ? typeName.name : typeEntry.type.name;
        })
      );

      return {
        number: index + 1,
        name: nameInFrench ? nameInFrench.name : pokemon.name,
        sprite: pokemonResponse.data.sprites.other['official-artwork'].front_default,
        types: typesInFrench,
      };
    } catch (error) {
      console.error('Erreur lors du chargement des détails Pokémon:', error);
      return { name: pokemon.name, sprite: null, types: [] };
    }
  };

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=721');
        const pokemonResults = response.data.results;

        const pokemonDetailsPromises = pokemonResults.map((pokemon, index) =>
          fetchPokemonDetails(pokemon, index)
        );
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);

        setPokemonList(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des Pokémon:', error);
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  const toggleCapture = (pokemonNumber) => {
    setCapturedPokemon((prevCaptured) => {
      if (prevCaptured.includes(pokemonNumber)) {
        return prevCaptured.filter((number) => number !== pokemonNumber);
      } else {
        return [...prevCaptured, pokemonNumber];
      }
    });
  };

  const toggleSeen = (pokemonNumber) => {
    setSeenPokemon((prevSeen) => {
      if (prevSeen.includes(pokemonNumber)) {
        return prevSeen.filter((number) => number !== pokemonNumber); // Marquer comme non vu
      } else {
        return [...prevSeen, pokemonNumber]; // Marquer comme vu
      }
    });
  };

  const handleMouseDown = (pokemonNumber) => {
    const timer = setTimeout(() => {
      toggleSeen(pokemonNumber);
    }, 1000);

    const handleMouseUp = () => clearTimeout(timer);
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h1>Pokédex</h1>
      <p>Total des Pokémon vus : {seenPokemon.length}</p>
      <p>Total des Pokémon capturés : {capturedPokemon.length}</p>
      <ul className="pokemon-list">
        {pokemonList.map((pokemon) => (
        <li key={pokemon.number} onClick={() => navigate(`/pokemon/${pokemon.number}`)}> {/* Redirection vers la page de détails */}
        <img
              src={pokemon.sprite}  
              alt={pokemon.name}
              className={seenPokemon.includes(pokemon.number) ? 'full-color' : 'silhouette'}
              onMouseDown={() => handleMouseDown(pokemon.number)}
            />
            <div className="pokemon-info">
              <p className="pokemon-name">#{pokemon.number} {pokemon.name}</p>
              <p className="pokemon-types">{pokemon.types ? pokemon.types.join(', ') : 'Types non disponibles'}</p>
            </div>
      <button onClick={() => toggleCapture(pokemon.number)}>
        {capturedPokemon.includes(pokemon.number) ? 'Libérer' : 'Capturer'}
      </button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default Pokedex;
