import { Role, HandCard, Tool } from "./Cards"
import { Slot } from './Map'

export default interface Player {
  name: string
  index: number
  gold: number
  role?: Role
  hand: HandCard[]
  blockers: Partial<Record<Tool, boolean>>
  selectedCard?: number
  peekedSlot: Slot[]
}
