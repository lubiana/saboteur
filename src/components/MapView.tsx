import React from "react"
import {Map, MapItem, Slot} from '../types/Map'
import {getBoundaries, canDestroyCard, canPeekCard, canPlaceCard, MapBoundaries} from "../utils/mapHelper"
import {SabCard} from "../types/Cards"
import {emptyCard} from "../generators/cardgen"
import SaboteurCard from "./SaboteurCard"
import GameState from "../types/GameState"
import {Ctx} from "boardgame.io"

interface MapViewProps {
  G: GameState
  ctx: Ctx
  moves: any
}

const getColumns = (map: Map): number[] => {
  const boundaries: MapBoundaries = getBoundaries(map)
  const columns: number[] = []
  for (let i: number = boundaries.minX - 1; i < boundaries.maxX + 2; i++) {
    columns.push(i)
  }
  return columns
}

const getRows = (map: Map): number[] => {
  const boundaries: MapBoundaries = getBoundaries(map)
  const rows: number[] = []
  for (let i: number = boundaries.minY - 1; i < boundaries.maxY + 2; i++) {
    rows.push(i)
  }
  return rows
}

const getCardForSlot = (x: number, y: number, map: Map, peekedSlots: Slot[] = []): SabCard => {
  const card = map.items.find((item: MapItem) => item.slot.x === x && item.slot.y === y)

  if (card) {
    const clone = {...card.card}
    if (peekedSlots.some(v => v.x === x && v.y === y) && 'uncovered' in clone) {
      clone.uncovered = true
    }
    return clone
  } else {
    return emptyCard()
  }
}

const getCurrentPlayersUncoveredSlots = (G: GameState, ctx: Ctx): Slot[] => {
  const currentPlayer = G.players[Number(ctx.currentPlayer)]
  if (currentPlayer === undefined) {
    return []
  }
  return currentPlayer.peekedSlot
}

const canClick = (G: GameState, ctx: Ctx, slot: Slot): boolean =>
  canPlaceCard(G, ctx, slot) ||
  canDestroyCard(G, ctx, slot) ||
  canPeekCard(G, ctx, slot)

const click = (G: GameState, ctx: Ctx, moves: any, slot: Slot) => {
  if (canPlaceCard(G, ctx, slot)) {
    moves.placeCard(slot)
    return
  }
  if (canDestroyCard(G, ctx, slot)) {
    moves.destroyCard(slot)
    return
  }
  if (canPeekCard(G, ctx, slot)) {
    moves.peek(slot)
    return
  }
  return
}

const MapView: React.FC<MapViewProps> = ({G, ctx, moves}) => {
  const playerPeeked = getCurrentPlayersUncoveredSlots(G, ctx)
  return (
    <div>
      <table>
        <tbody>
        {getRows(G.map).map((y: number, yIndex: number) => (
          <tr key={yIndex}>
            {getColumns(G.map).map((x: number, xIndex: number) => (
              <td key={xIndex}>
                <SaboteurCard
                  card={getCardForSlot(x, y, G.map, playerPeeked)}
                  elevation={canClick(G, ctx, {x: x, y: y}) ? 5 : 0}
                  onClick={
                    canClick(G, ctx, {x: x, y: y})
                      ? () => click(G, ctx, moves, {x: x, y: y})
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
