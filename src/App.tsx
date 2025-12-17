import { use, useEffect, useState } from "react";

import "./App.css";

const test = [
  {
    id: 1,
    img: "/1.jpg",
  },
  {
    id: 2,
    img: "/2.jpg",
  },
  {
    id: 3,
    img: "/3.jpg",
  },
  {
    id: 4,
    img: "/4.jpg",
  },
  {
    id: 5,
    img: "/5.jpg",
  },
  {
    id: 6,
    img: "/6.jpg",
  },
];
interface FetchPokemon {
  id: number;
  monPic: string;
}
function App() {
  const [pokemons, setPokemons] = useState<FetchPokemon[]>([]);

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
  return (
    <div className="container">
      <h1>Memory Game</h1>
      <p>Score:</p>
      <p>Best score:</p>
      <Pokemons mons={pokemons} />
    </div>
  );
}

function Pokemons({ mons }) {
  return (
    <div className="mons">
      {mons.map((el) => (
        <div className="box">
          <img src={el.monPic} />
        </div>
      ))}
    </div>
  );
}

export default App;
