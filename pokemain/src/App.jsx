import React, { useState, useEffect } from 'react';
import "./App.css"

function App() {
  const [pokemonArr, setPokemonArr] = useState([]);
  const [filter, setFilter] = useState('');
  const [startingPoint, setStartingPoint] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
      filterPokemonList(filter);
  }, [filter]);

  const fetchPokemon = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${startingPoint}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        const promises = data.results.map(result =>
          fetch(result.url).then(res1 => res1.json())
        );
        Promise.all(promises).then(pokemonData => {
          setPokemonArr(prevArr => [...prevArr, ...pokemonData]);
        });
      })
      .catch(error => console.log(error));

    setStartingPoint(prevStartingPoint => prevStartingPoint + limit);
  };

  const renderPokemonList = () => {
    return pokemonArr.map(pokemon => <PokemonCard key={pokemon.id} pokemon={pokemon} />);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  function filterPokemonList(filter) {  
    const filteredList = pokemonArr.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(filter.toLowerCase())
    );
    setPokemonArr(filteredList);
    // window.location.reload()
  }
 
  return (
    <div>
      <input type="text" placeholder="Search Pokemon" value={filter} onChange={handleFilterChange}  />
      <div className="pokemon">{renderPokemonList()}</div>
      <button className='button' onClick={fetchPokemon}>Load More</button>
    </div>
  );
}

function PokemonCard({ pokemon }) {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <p>id : {pokemon.id}</p>
          <p>Type name : {pokemon.types[0].type.name}</p>
          <p>name : {pokemon.name}</p>
          <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} className="imgs" />
        </div>
        <div className="flip-card-back">
          <p>height {pokemon.height}</p>
          <p>weight :{pokemon.weight}</p>
          <p>species :{pokemon.species.name}</p>
          {pokemon.stats.map((el, index) => (
            <p key={index}>{el.stat.name} : {el.base_stat}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
