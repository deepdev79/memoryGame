import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Bulbasaur from "../public/Bulbasaur.json";
import "./App.css";

interface FetchPokemon {
  id: number;
  monPic: string;
}
function App() {
  const [pokemons, setPokemons] = useState<FetchPokemon[]>([]);
  const [score, setScore] = useState(0);
  const [prevClick, setPrevClick] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    }
    getPokemon();
  }, []);

  function handlePokemonClick(id: number) {
    if (prevClick.length === 0) {
      setPrevClick((prev) => [...prev, id]);
      setScore(1);
    } else if (prevClick.includes(id)) {
      if (score > bestScore.current) bestScore.current = score;
      setScore(0);
      setPrevClick([]);
      return;
    } else {
      setPrevClick((prev) => [...prev, id]);
      setScore((s) => s + 1);
    }
    shufflePokemons();
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
      {isLoading ? (
        <div className="loading">
          <Lottie.default
            animationData={Bulbasaur}
            loop={true}
            autoplay={true}
            style={{ height: 300, width: 300 }} // Customize size
          />
        </div>
      ) : (
        <Pokemons mons={pokemons} onPokemonClick={handlePokemonClick} />
      )}
    </div>
  );
}

interface PokemonsProps {
  mons: FetchPokemon[];
  onPokemonClick: (id: number) => void;
}

function Pokemons({ mons, onPokemonClick }: PokemonsProps) {
  return (
    <div className="mons">
      {mons.map((el: FetchPokemon) => (
        <motion.div
          layout
          className="box"
          key={el.id}
          onClick={() => onPokemonClick(el.id)}
        >
          <img src={el.monPic} alt={`Pokemon ${el.id}`} />
        </motion.div>
      ))}
    </div>
  );
}

export default App;
