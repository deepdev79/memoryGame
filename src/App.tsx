import { Children, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [modalstatus, setModalstatus] = useState(false);
  const [prevClick, setPrevClick] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(0);
  const bestScore = useRef(0);

  useEffect(
    function () {
      if (limit === 0) return;
      async function getPokemon(): Promise<void> {
        const randomIds = new Set<number>();
        while (randomIds.size < limit) {
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
    },
    [limit]
  );

  function resetGame() {
    setScore(0);
    setPrevClick([]);
    setModalstatus(false);
  }
  function handlePokemonClick(id: number) {
    if (prevClick.length === 0) {
      setPrevClick((prev) => [...prev, id]);
      setScore(1);
    } else if (prevClick.includes(id)) {
      if (score > bestScore.current) bestScore.current = score;
      setModalstatus(true);
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
      {!limit && (
        <DecisionModal>
          <div className="difficulty">
            <button className="btn" onClick={() => setLimit(5)}>
              Easy
            </button>
            <button className="btn" onClick={() => setLimit(12)}>
              Medium
            </button>
            <button className="btn" onClick={() => setLimit(20)}>
              Hard
            </button>
          </div>
        </DecisionModal>
      )}
      <h1>Memory Game</h1>
      <div className="scores">
        <p>Score: {score}</p>
        <p>Best score: {bestScore.current}</p>
      </div>
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
      <AnimatePresence>
        {modalstatus && (
          <DecisionModal>
            <h2>{modalstatus ? "You Win! 🎉" : "Game Over! 💀"}</h2>
            <p>Final Score: {score}</p>
            <button onClick={resetGame}>Play Again</button>
          </DecisionModal>
        )}
      </AnimatePresence>
    </div>
  );
}

function DecisionModal({ children }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, y: -20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
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
