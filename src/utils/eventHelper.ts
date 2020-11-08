import { Ctx } from "boardgame.io"
export const endTurn = (c: Ctx) => {
  if (c.events !== undefined && c.events.endTurn !== undefined) {
    c.events.endTurn()
  }
}
