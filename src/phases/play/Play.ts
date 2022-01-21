import {pathToZero} from '../../utils/mapHelper'
import {blockPlayer, destroyCard, discardCard, flipCard, peek, placeCard, selectCard, unblockPlayer} from "./moves";
import {endIf, onBegin, onEnd} from "./hooks";
import GameState from "../../types/GameState";
import {Ctx} from "boardgame.io";
import {isEndTile} from "../../types/guards";

const updateEndTiles = (G: GameState, ctx: Ctx): GameState => {
  G.map.items.map((i) => {
    if (isEndTile(i.card) && i.card.uncovered) {
      i.card.uncovered = pathToZero(i.slot, i.card.openSides, G.map.items)
    }
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
    unblockPlayer: unblockPlayer,
    destroyCard,
    peek,
  },
}

export default Play
