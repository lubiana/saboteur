import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {Slot} from "../../../types/Map";
import {discardCard} from "./index";

const peek = (G: GameState, ctx: Ctx, slot: Slot) => {
    G.players[Number(ctx.currentPlayer)].peekedSlot.push(slot)
    discardCard(G, ctx)
}

export default peek
