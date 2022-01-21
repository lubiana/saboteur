import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {getSelectedCard} from "../../../utils/cardHelper";
import {Action, CardType} from "../../../types/Cards";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";

const unBlockPlayer = (G: GameState, ctx: Ctx, playerId: number) => {
    const selectedCard = getSelectedCard(G, ctx)

    if (selectedCard === undefined || selectedCard.type !== CardType.Action || selectedCard.action !== Action.Unblock || selectedCard.blockItems === undefined) {
        return INVALID_MOVE
    }
    const blockerIndex = G.players[playerId].blockers.findIndex(b => selectedCard.blockItems?.includes(b))
    if (blockerIndex === -1) {
        return INVALID_MOVE
    }
    G.players[playerId].blockers.splice(blockerIndex, 1)
    discardCard(G, ctx)
}

export default unBlockPlayer
