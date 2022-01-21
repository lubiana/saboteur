import GameState from "../../../types/GameState";
import Player from "../../../types/Player";

const endIf = (G: GameState) =>
    G.players.filter((player: Player) => player.role === null).length === 0

export default endIf
