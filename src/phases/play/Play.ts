import {pathToZero} from '../../utils/mapHelper'
import {blockPlayer, destroyCard, discardCard, flipCard, peek, placeCard, selectCard, unBlockPlayer} from "./moves";
import {endIf, onBegin, onEnd} from "./hooks";
import GameState from "../../types/GameState";
import {Ctx} from "boardgame.io";

const updateEndTiles = (G: GameState, ctx: Ctx): GameState => {
  G.map.items.map((i) => {
    if (!('uncovered' in i.card)) {
      return i
    }
    if (i.card.uncovered) {
      return i
    }
    i.card.uncovered = pathToZero(i.slot, i.card.openSides, G.map.items)
    return i
  })
  return G
}


const Play = {
  next: 'start',
  onBegin,
  onEnd,
  endIf,
  turn: {
    onBegin: updateEndTiles,
  },
  moves: {
    discardCard,
    selectCard,
    placeCard,
    flipCard,
    blockPlayer,
    unBlockPlayer,
    destroyCard,
    peek,
  },
}

export default Play