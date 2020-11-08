import { Client } from "boardgame.io/react";
import Saboteur from "./Game";
import Board from "./components/Board";
import "fontsource-roboto";

const App = Client({
  game: Saboteur,
  numPlayers: 3,
  board: Board,
});

export default App;
