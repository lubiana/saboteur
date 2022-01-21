import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {getSelectedCard} from "../../../utils/cardHelper";
import {Action, CardType} from "../../../types/Cards";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";

const blockPlayer = (G: GameState, ctx: Ctx, playerId: number) => {
    const selectedCard = getSelectedCard(G, ctx)
    if (selectedCard === undefined ||
        selectedCard.type !== CardType.Action ||
        selectedCard.action !== Action.Block ||
        selectedCard.blockItems === undefined) {
        return INVALID_MOVE
    }
    G.players[playerId].blockers.push(selectedCard.blockItems[0])
    discardCard(G, ctx)
}

export default blockPlayer
