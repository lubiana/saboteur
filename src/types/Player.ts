import { Role, HandCard, BlockItem } from "./Cards"
import { Slot } from './Map'

export default interface Player {
  name: string
  index: number
  gold: number
  role: Role | null
  hand: HandCard[]
  blockers: BlockItem[]
  selectedCard?: number
  peekedSlot: Slot[]
}

export const player1: Player = {
  name: "lubi",
  index: 0,
  gold: 0,
  role: null,
  hand: [],
  blockers: [],
  peekedSlot: [],
}
