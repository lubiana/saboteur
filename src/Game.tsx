import Start from "./phases/Start"
import GameState from "./types/GameState"
import Play from "./phases/Play"
import { Ctx } from 'boardgame.io'

const Saboteur = {
  name: "Saboteur",
  minPlayers: 2,
  maxPlayers: 11,
  setup: (): GameState => {
    return {
      players: [
        {
          name: "lubi",
          index: 0,
          gold: 0,
          role: null,
          cards: [],
          blockers: [],
        },
        {
          name: "du",
          index: 1,
          gold: 0,
          role: null,
          cards: [],
          blockers: [],
        },
        {
          name: "ich",
          index: 2,
          gold: 0,
          role: null,
          cards: [],
          blockers: [],
        },
      ],
      drawPile: [],
      discardPile: [],
      roleCards: [],
      selectedCard: null,
      map: { items: [] },
    }
  },
  phases: {
    start: Start,
    play: Play,
  },
}

export default Saboteur
