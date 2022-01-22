import {Ctx} from "boardgame.io"

export const endTurn = (ctx: Ctx) =>
  ctx.events && ctx.events.endTurn && ctx.events.endTurn()
