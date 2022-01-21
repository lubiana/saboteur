import Start from "./phases/start/Start"
import GameState from "./types/GameState"
import Play from "./phases/play/Play"

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
          hand: [],
          blockers: {},
          peekedSlot: [],
        },
        {
          name: "du",
          index: 1,
          gold: 0,
          hand: [],
          blockers: {},
          peekedSlot: [],
        },
        {
          name: "ich",
          index: 2,
          gold: 0,
          hand: [],
          blockers: {},
          peekedSlot: [],
        },
      ],
      drawPile: [],
      discardPile: [],
      roleCards: [],
      map: { items: [] },
    }
  },
  phases: {
    start: Start,
    play: Play,
  },
}

export default Saboteur
