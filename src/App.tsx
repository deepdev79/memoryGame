import { use, useEffect, useRef, useState } from "react";

import "./App.css";

interface FetchPokemon {
  id: number;
  monPic: string;
}
function App() {
  const [pokemons, setPokemons] = useState<FetchPokemon[]>([]);
  const [score, setScore] = useState(0);
  const [prevClick, setPrevClick] = useState<number[]>([]);
  const bestScore = useRef(0);

  useEffect(function () {
    async function getPokemon(): Promise<void> {
      const randomIds = new Set<number>();
      while (randomIds.size < 20) {
        randomIds.add(Math.floor(Math.random() * (1020 - 1 + 1)) + 1);
      }
      const fetchPromises = Array.from(randomIds).map(async (id) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        const data = await res.json();
        return {
          id: id,
          monPic: data.sprites.other["official-artwork"].front_default,
        };
      });
      const result = await Promise.all(fetchPromises);
      setPokemons(result);
    }
    getPokemon();
  }, []);

  function handlePokemonClick(id: number) {
    if (prevClick.length === 0) {
      setPrevClick((prev) => [...prev, id]);
      setScore(1);
      return;
    } else if (prevClick.includes(id)) {
      if (score > bestScore.current) bestScore.current = score;
      setScore(0);
      setPrevClick([]);
      return;
    }
    setPrevClick((prev) => [...prev, id]);
    setScore((s) => s + 1);
  }

  function shufflePokemons() {
    setPokemons((prevPokemons) => {
      const shuffled = [...prevPokemons];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }

  return (
    <div className="container">
      <h1>Memory Game</h1>
      <p>Score: {score}</p>
      <p>Best score: {bestScore.current}</p>
      <Pokemons mons={pokemons} onPokemonClick={handlePokemonClick} />
      <button onClick={shufflePokemons}>Click me</button>
    </div>
  );
}

function Pokemons({ mons, onPokemonClick }) {
  return (
    <div className="mons">
      {mons.map((el) => (
        <div className="box" key={el.id} onClick={() => onPokemonClick(el.id)}>
          <img src={el.monPic} alt={`Pokemon ${el.id}`} />
        </div>
      ))}
    </div>
  );
}

export default App;
