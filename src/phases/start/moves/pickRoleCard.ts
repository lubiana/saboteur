import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {endTurn} from "../../../utils/contextHelper";

const pickRoleCard = (G: GameState, ctx: Ctx, index: number) => {
    const roleCard = G.roleCards.splice(index, 1)[0]
    if (roleCard !== undefined) {
        G.players[Number(ctx.currentPlayer)].role = roleCard.role
    }
    endTurn(ctx)
}

export default pickRoleCard
