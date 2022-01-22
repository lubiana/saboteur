import GameState from "../../../types/GameState";
import Player from "../../../types/Player";

const endIf = (G: GameState) =>
    G.players.every((player: Player) => player.role)

export default endIf
