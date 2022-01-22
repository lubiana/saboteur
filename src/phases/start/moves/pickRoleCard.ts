import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";

const pickRoleCard = (G: GameState, ctx: Ctx, index: number) => {
    const roleCard = G.roleCards.splice(index, 1)[0]
    if (roleCard !== undefined) {
        G.players[Number(ctx.currentPlayer)].role = roleCard.role
    }
    ctx.events?.endTurn()
}

export default pickRoleCard
