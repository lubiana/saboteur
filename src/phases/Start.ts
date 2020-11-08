import { Ctx } from "boardgame.io"
import GameState from "../types/GameState"
import generateRoles from "../generators/rolecards"
import Player from "../types/Player"

const Start = {
  start: true,
  next: "play",
  onBegin: (G: GameState, ctx: Ctx) => {
    G.drawPile = []
    G.discardPile = []
    G.roleCards = generateRoles(G.players.length)
    G.players.map((player: Player) => (player.role = null))
    if (ctx.random !== undefined) {
      G.roleCards = ctx.random.Shuffle(G.roleCards)
    }
    G.map = { items: [] }
  },
  onEnd: (G: GameState, ctx: Ctx) => {
    G.roleCards = []
  },
  endIf: (G: GameState) => G.players.filter((player: Player) => player.role === null).length === 0,
  moves: {
    pickRoleCard: (G: GameState, ctx: Ctx | any, index: number) => {
      const roleCard = G.roleCards.splice(index, 1)[0]
      if (roleCard !== undefined) {
        G.players[Number(ctx.currentPlayer)].role = roleCard.role
      }
      ctx.events.endTurn()
    },
  },
}

export default Start
