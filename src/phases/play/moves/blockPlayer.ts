import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {getSelectedCard} from "../../../utils/cardHelper";
import {Action} from "../../../types/Cards";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";
import {isBlockCard} from "../../../types/typeGuards";

const blockPlayer = (G: GameState, ctx: Ctx, playerId: number) => {
    const selectedCard = getSelectedCard(G, ctx)
    if (!isBlockCard(selectedCard) || selectedCard.action !== Action.Block) {
        return INVALID_MOVE
    }
    G.players[playerId].blockers.push(selectedCard.blockItems[0])
    discardCard(G, ctx)
}

export default blockPlayer
