import GameState from "../../../types/GameState";
import {goldDiscovered} from "../../../utils/mapHelper";
import Player from "../../../types/Player";

const endIf = (G: GameState) => {
    if (goldDiscovered(G)) {
        return true
    }
    if (G.drawPile.length > 0) {
        return false
    }
    if (G.discardPile.length === 0) {
        return false
    }
    return !G.players.some((player: Player) => player.hand.length > 0)
}

export default endIf
