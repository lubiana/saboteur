import React from "react"
import { Map, MapItem } from "../types/Map"
import getBoundaries, { mapBounddaries } from "../utils/mapHelper"
import { SabCard } from "../types/Cards"
import { emptyCard } from "../generators/cardgen"
import SaboteurCard from "./SaboteurCard"
import { canPlaceCard } from "../utils/mapHelper"
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

const getCardForCoord = (x: number, y: number, map: Map): SabCard => {
  const card: MapItem | undefined = map.items.find((item: MapItem) => {
    return item.coords.x === x && item.coords.y === y
  })
  if (card !== undefined) {
    return card.card
  }
  return emptyCard()
}

const MapView: React.FC<MapViewProps> = ({ G, ctx, moves }) => (
  <div>
    <table>
      <tbody>
        {getRows(G.map).map((y: number, yIndex: number) => (
          <tr key={yIndex}>
            {getColumns(G.map).map((x: number, xIndex: number) => (
              <td key={xIndex}>
                <SaboteurCard
                  card={getCardForCoord(x, y, G.map)}
                  elevation={canPlaceCard(G, ctx, x, y) ? 5 : 0}
                  onClick={
                    canPlaceCard(G, ctx, x, y)
                      ? () => {
                        moves.placeCard(x, y)
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

export default MapView
