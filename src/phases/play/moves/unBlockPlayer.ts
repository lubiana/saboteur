import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {getSelectedCard} from "../../../utils/cardHelper";
import {Action} from "../../../types/Cards";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";
import {isBlockCard} from "../../../types/guards";

const unBlockPlayer = (G: GameState, ctx: Ctx, playerId: number) => {
    const selectedCard = getSelectedCard(G, ctx)

    if (!isBlockCard(selectedCard) || selectedCard.action !== Action.Unblock) {
        return INVALID_MOVE
    }
    const blockerIndex = G.players[playerId].blockers.findIndex(b => selectedCard.blockItems.includes(b))
    if (blockerIndex === -1) {
        return INVALID_MOVE
    }
    G.players[playerId].blockers.splice(blockerIndex, 1)
    discardCard(G, ctx)
}

export default unBlockPlayer
