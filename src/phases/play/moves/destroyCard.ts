import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {Slot} from "../../../types/Map";
import {canDestroyCard, removeCardFromMap} from "../../../utils/mapHelper";
import {INVALID_MOVE} from "boardgame.io/core";
import {discardCard} from "./index";

const destroyCard = (G: GameState, ctx: Ctx, slot: Slot) => {
  if (canDestroyCard(G, ctx, slot)) {
    removeCardFromMap(G, ctx, slot)
    discardCard(G, ctx)
  } else {
    return INVALID_MOVE
  }
}

export default destroyCard
