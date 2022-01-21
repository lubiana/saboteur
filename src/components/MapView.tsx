import React from "react"
import {Map, MapItem, Slot} from '../types/Map'
import {getBoundaries, canDestroyCard, canPeekCard, canPlaceCard, MapBoundaries} from "../utils/mapHelper"
import {SabCard} from "../types/Cards"
import {emptyCard} from "../generators/cardgen"
import SaboteurCard from "./SaboteurCard"
import GameState from "../types/GameState"
import {Ctx} from "boardgame.io"
import {isEndTile} from "../types/guards";

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
  const item = map.items.find(({slot}: MapItem) => slot.x === x && slot.y === y)

  if (item) {
    const clone = {...item.card}
    if (peekedSlots.some(v => v.x === x && v.y === y) && isEndTile(clone)) {
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

const MapView: React.FC<MapViewProps> = ({G, ctx, moves}) => {
  const playerPeeked = getCurrentPlayersUncoveredSlots(G, ctx)

  const canClick = (slot: Slot): boolean =>
    canPlaceCard(G, ctx, slot) ||
    canDestroyCard(G, ctx, slot) ||
    canPeekCard(G, ctx, slot)

  const handleClick = (slot: Slot) => {
    if (canPlaceCard(G, ctx, slot)) {
      moves.placeCard(slot)
    } else if (canDestroyCard(G, ctx, slot)) {
      moves.destroyCard(slot)
    } else if (canPeekCard(G, ctx, slot)) {
      moves.peek(slot)
    }
  }

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
                  elevation={canClick({x, y}) ? 5 : 0}
                  onClick={() => handleClick({x, y})}
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
