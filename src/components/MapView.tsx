import React from "react"
import { Map, MapItem, Coordinate } from '../types/Map'
import getBoundaries, { mapBounddaries } from "../utils/mapHelper"
import { SabCard } from "../types/Cards"
import { emptyCard } from "../generators/cardgen"
import SaboteurCard from "./SaboteurCard"
import { canPlaceCard, canDestroyCard, canPeekCard } from '../utils/mapHelper'
import GameState from "../types/GameState"
import { Ctx } from "boardgame.io"

interface MapViewProps {
  G: GameState
  ctx: Ctx
  moves: any
}

const getColumns = (map: Map): number[] => {
  const boundaries: mapBounddaries = getBoundaries(map)
  const columns: number[] = []
  for (let i: number = boundaries.minX - 1; i < boundaries.maxX + 2; i++) {
    columns.push(i)
  }
  return columns
}

const getRows = (map: Map): number[] => {
  const boundaries: mapBounddaries = getBoundaries(map)
  const rows: number[] = []
  for (let i: number = boundaries.minY - 1; i < boundaries.maxY + 2; i++) {
    rows.push(i)
  }
  return rows
}

const getCardForCoord = (x: number, y: number, map: Map, peekedCoords: Coordinate[] = []): SabCard => {
  const card: MapItem | undefined = map.items.find((item: MapItem) => {
    return item.coords.x === x && item.coords.y === y
  })
  if (card !== undefined) {
    const clone = { ...card.card }
    if (peekedCoords.some(v => v.x === x && v.y === y) && 'uncovered' in clone) {
      clone.uncovered = true
    }
    return clone
  }
  return emptyCard()
}

const getCurrentPlayersUncoveredCoords = (G: GameState, ctx: Ctx): Coordinate[] => {
  const currentPlayer = G.players[Number(ctx.currentPlayer)]
  if (currentPlayer === undefined) {
    return []
  }
  return currentPlayer.peekedCoords
}

const canClick = (G: GameState, ctx: Ctx, coord: Coordinate): boolean => {
  return canPlaceCard(G, ctx, coord.x, coord.y) || canDestroyCard(G, ctx, coord) || canPeekCard(G, ctx, coord)
}

const click = (G: GameState, ctx: Ctx, moves: any, coord: Coordinate) => {
  if (canPlaceCard(G, ctx, coord.x, coord.y)) {
    moves.placeCard(coord.x, coord.y)
    return
  }
  if (canDestroyCard(G, ctx, coord)) {
    moves.destroyCard(coord)
    return
  }
  if (canPeekCard(G, ctx, coord)) {
    moves.peek(coord)
    return
  }
  return
}

const MapView: React.FC<MapViewProps> = ({ G, ctx, moves }) => {
  const playerPeeked = getCurrentPlayersUncoveredCoords(G, ctx)
  return (
    <div>
      <table>
        <tbody>
          {getRows(G.map).map((y: number, yIndex: number) => (
            <tr key={yIndex}>
              {getColumns(G.map).map((x: number, xIndex: number) => (
                <td key={xIndex}>
                  <SaboteurCard
                    card={getCardForCoord(x, y, G.map, playerPeeked)}
                    elevation={canClick(G, ctx, { x: x, y: y }) ? 5 : 0}
                    onClick={
                      canClick(G, ctx, { x: x, y: y })
                        ? () => {
                          click(G, ctx, moves, { x: x, y: y })
                        }
                        : undefined
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export default MapView
