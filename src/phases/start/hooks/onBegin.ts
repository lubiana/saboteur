import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import generateRoles from "../../../generators/rolecards";
import Player from "../../../types/Player";

const onBegin = (G: GameState, ctx: Ctx) => {
  G.drawPile = []
  G.discardPile = []
  G.roleCards = generateRoles(G.players.length)
  G.players.forEach((player: Player) => player.role = undefined)
  G.roleCards = ctx.random!!.Shuffle(G.roleCards)
  G.map = {items: []}
}

export default onBegin
