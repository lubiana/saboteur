import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {goldDiscovered} from "../../../utils/mapHelper";
import generateRoles from "../../../generators/rolecards";
import Player from "../../../types/Player";
import {Role} from "../../../types/Cards";

const onEnd = (G: GameState, ctx: Ctx) => {
    const diggerWin = goldDiscovered(G)
    G.drawPile = []
    G.discardPile = []
    G.roleCards = generateRoles(G.players.length)
    G.players.map((player: Player) => {
        if (player.role === Role.Digger && diggerWin && ctx.random !== undefined) {
            player.gold = player.gold + ctx.random.Die(4)
        }
        if (player.role === Role.Saboteur && !diggerWin && ctx.random !== undefined) {
            player.gold = player.gold + ctx.random.Die(4)
        }
        player.role = undefined
        player.hand = []
        player.blockers = []
        return player
    })
    if (ctx.random !== undefined) {
        G.roleCards = ctx.random.Shuffle(G.roleCards)
    }
    G.map = { items: [] }
}

export default onEnd
