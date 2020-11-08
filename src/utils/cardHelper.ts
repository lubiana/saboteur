import { Coordinate } from '../types/Map'
import { OpenSide } from '../types/Cards'

export const coordForSide = (coords: Coordinate, side: OpenSide): Coordinate => {
    if (side === OpenSide.Up) return { x: coords.x, y: coords.y - 1 }
    if (side === OpenSide.Down) return { x: coords.x, y: coords.y + 1 }
    if (side === OpenSide.Left) return { x: coords.x - 1, y: coords.y }
    if (side === OpenSide.Right) return { x: coords.x + 1, y: coords.y }
    throw (new Error('Invalid Input'))
}

export const flipSide = (side: OpenSide): OpenSide => {
    if (side === OpenSide.Up) return OpenSide.Down
    if (side === OpenSide.Down) return OpenSide.Up
    if (side === OpenSide.Left) return OpenSide.Right
    if (side === OpenSide.Right) return OpenSide.Left
    throw (new Error('Invalid Input'))
}