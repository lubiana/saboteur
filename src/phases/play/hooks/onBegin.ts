import GameState from "../../../types/GameState";
import {Ctx} from "boardgame.io";
import {EndTile, HandCard} from "../../../types/Cards";
import {endTiles, generateCards} from "../../../generators/cardgen";
import mapGen from "../../../generators/mapgen";
import Player from "../../../types/Player";

const onBegin = (G: GameState, ctx: Ctx) => {
    let cards: HandCard[] = generateCards()
    let endTileList: EndTile[] = endTiles()
    if (ctx.random !== undefined) {
        cards = ctx.random.Shuffle(cards)
        endTileList = ctx.random.Shuffle(endTileList)
    }
    G.map = mapGen([endTileList[0], endTileList[1], endTileList[2]])
    G.drawPile = cards
    G.discardPile = []
    G.players = G.players.map((player: Player) => {
        player.hand = G.drawPile.splice(0, 5)
        return player
    })
}

export default onBegin
