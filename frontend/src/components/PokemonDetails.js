import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PokemonDetails = () => {
  const { id } = useParams(); // Récupère l'ID du Pokémon depuis l'URL
  const [pokemonDetails, setPokemonDetails] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemonDetails(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des détails Pokémon:', error);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (!pokemonDetails) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h1>{pokemonDetails.name}</h1>
      <img src={pokemonDetails.sprites.other['official-artwork'].front_default} alt={pokemonDetails.name} />
      <p>Poids : {pokemonDetails.weight}</p>
      <p>Taille : {pokemonDetails.height}</p>
      {/* Ajoute d'autres informations selon les besoins */}
    </div>
  );
};

export default PokemonDetails;
