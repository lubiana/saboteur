import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {goldDiscovered} from "../../../utils/mapHelper";
import generateRoles from "../../../generators/rolecards";
import Player from "../../../types/Player";

const isWinner = (player: Player, diggerWin: boolean) =>
  (player.role === "Digger" && diggerWin) ||
  (player.role === "Saboteur" && !diggerWin)

const onEnd = (G: GameState, ctx: Ctx) => {
  const diggerWin = goldDiscovered(G)
  G.drawPile = []
  G.discardPile = []
  G.roleCards = generateRoles(G.players.length)
  G.players.map((player: Player) => {
    if (isWinner(player, diggerWin)) {
      player.gold = player.gold + ctx.random!!.D4()
    }
    player.role = undefined
    player.hand = []
    player.blockers = {}
    return player
  })
  G.roleCards = ctx.random!!.Shuffle(G.roleCards)
  G.map = {items: []}
}

export default onEnd
