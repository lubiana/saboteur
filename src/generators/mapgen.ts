import { Map, MapItem } from "../types/Map"
import { CardType, EndTile, OpenSide, MapTile } from "../types/Cards"

const mapGen = (endTiles: [EndTile, EndTile, EndTile]): Map => {
  const items: MapItem[] = []
  const startTile: MapTile = {
    type: CardType.Start,
    openSides: [OpenSide.Left, OpenSide.Right, OpenSide.Down, OpenSide.Up],
    deadEnd: false,
  }
  items.push({
    slot: {
      x: 0,
      y: 0,
    },
    card: startTile,
  })
  items.push({
    slot: {
      x: 8,
      y: 0,
    },
    card: endTiles[0],
  })
  items.push({
    slot: {
      x: 8,
      y: 2,
    },
    card: endTiles[1],
  })
  items.push({
    slot: {
      x: 8,
      y: -2,
    },
    card: endTiles[2],
  })
  return {
    items,
  }
}

export default mapGen
