import Player from "./Player"
import { HandCard, RoleCard } from "./Cards"
import { Map } from "./Map"

export default interface GameState {
  players: Player[]
  drawPile: HandCard[]
  discardPile: HandCard[]
  roleCards: RoleCard[]
  selectedCard: number | null
  map: Map
}
