// src/components/Pokedex.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les détails d'un Pokémon (nom, sprite, types en français)
  const fetchPokemonDetails = async (pokemon, index) => {
    try {
      const response = await axios.get(pokemon.url.replace('pokemon', 'pokemon-species'));
      const speciesData = response.data;

      // Récupérer le nom en français
      const nameInFrench = speciesData.names.find(
        (nameEntry) => nameEntry.language.name === 'fr'
      );

      // Récupérer les types du Pokémon
      const pokemonResponse = await axios.get(pokemon.url);
      const typesInFrench = await Promise.all(
        pokemonResponse.data.types.map(async (typeEntry) => {
          const typeResponse = await axios.get(typeEntry.type.url);
          const typeName = typeResponse.data.names.find(
            (nameEntry) => nameEntry.language.name === 'fr'
          );
          return typeName ? typeName.name : typeEntry.type.name; // Types en français
        })
      );

      return {
        number: index + 1, // Numéro du Pokémon
        name: nameInFrench ? nameInFrench.name : pokemon.name, // Nom en français
        sprite: pokemonResponse.data.sprites.other['official-artwork'].front_default, // Sprite du Pokémon
        types: typesInFrench, // Types en français
      };
    } catch (error) {
      console.error('Erreur lors du chargement des détails Pokémon:', error);
      return { name: pokemon.name, sprite: null, types: [] };
    }
  };

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=721'); // Jusqu'à 721 Pokémon
        const pokemonResults = response.data.results;

        // Récupérer les détails de chaque Pokémon
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

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h1>Pokédex</h1>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.number}>
            <p>#{pokemon.number} {pokemon.name}</p>
            <img src={pokemon.sprite} alt={pokemon.name} />
            {/* Ajout d'une vérification pour éviter l'erreur join */}
            <p>{pokemon.types ? pokemon.types.join(', ') : 'Types non disponibles'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pokedex;
