import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";

const onEnd = (G: GameState, ctx: Ctx) => {
    G.roleCards = []
}

export default onEnd
