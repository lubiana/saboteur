import { MapCard } from "./Cards"

export interface Map {
  items: MapItem[]
}

export type MapRow = MapCard[]
export interface MapItem {
  slot: Slot
  card: MapCard
}

export interface Slot {
  x: number
  y: number
}
