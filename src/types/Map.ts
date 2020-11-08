import { MapCard } from "./Cards"

export interface Map {
  items: MapItem[]
}
export type MapRow = MapCard[]
export interface MapItem {
  coords: Coordinate
  card: MapCard
}

export interface Coordinate {
  x: number
  y: number
}
