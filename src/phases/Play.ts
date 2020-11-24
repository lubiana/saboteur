import { Ctx } from "boardgame.io"
import GameState from "../types/GameState"
import Player from "../types/Player"
import { generateCards, endTiles } from "../generators/cardgen"
import { HandCard, EndTile, CardType, Role, Action } from '../types/Cards'
import mapGen from "../generators/mapgen"
import { INVALID_MOVE } from "boardgame.io/core"
import { endTurn } from "../utils/eventHelper"
import { goldDiscovered } from '../utils/mapHelper'
import generateRoles from '../generators/rolecards'
import { flipSide, getSelectedCard, getSelectedCardType } from '../utils/cardHelper'
import { Coordinate } from '../types/Map'

const Play = {
  next: 'start',
  onBegin: (G: GameState, ctx: Ctx) => {
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
      player.cards = G.drawPile.splice(0, 5)
      return player
    })
  },
  onEnd: (G: GameState, ctx: Ctx) => {
    const diggerWin = goldDiscovered(G)
    G.drawPile = []
    G.discardPile = []
    G.roleCards = generateRoles(G.players.length)
    G.players.map((player: Player) => {
      if (player.role === Role.Digger && diggerWin && ctx.random !== undefined) {
        player.gold = player.gold + ctx.random.Die(4)
      }
      if (player.role === Role.Saboteur && !diggerWin && ctx.random !== undefined) {
        player.gold = player.gold + ctx.random.Die(4)
      }
      player.role = null
      player.cards = []
      player.blockers = []
      return player
    })
    if (ctx.random !== undefined) {
      G.roleCards = ctx.random.Shuffle(G.roleCards)
    }
    G.map = { items: [] }
  },
  endIf: (G: GameState) => {
    if (goldDiscovered(G)) {
      return true
    }
    if (G.drawPile.length > 0) {
      return false
    }
    if (G.discardPile.length === 0) {
      return false
    }
    return !G.players.some((player: Player) => player.cards.length > 0)
  },
  moves: {
    discardCard: (G: GameState, ctx: Ctx) => {
      const currentPlayer = Number(ctx.currentPlayer)
      const selectedCard = G.players[currentPlayer].selectedCard
      if (selectedCard === undefined) {
        return INVALID_MOVE
      }
      const card: HandCard[] = G.players[currentPlayer].cards.splice(selectedCard, 1)
      G.players[currentPlayer].selectedCard = undefined
      G.discardPile.push(...card)
      const playerCard = G.drawPile.pop()
      if (playerCard !== undefined) {
        G.players[currentPlayer].cards.push(playerCard)
      }
      endTurn(ctx)
    },
    selectCard: (G: GameState, ctx: Ctx, index: number) => {
      const currentPlayer = Number(ctx.currentPlayer)
      if (
        index === G.players[currentPlayer].selectedCard &&
        G.players[currentPlayer].cards[index].type === CardType.Path
      ) {
        Play.moves.flipCard(G, ctx)
        return
      }
      if (index in G.players[currentPlayer].cards) {
        G.players[currentPlayer].selectedCard = index
        return
      }
      return INVALID_MOVE
    },
    placeCard: (G: GameState, ctx: Ctx, x: number, y: number) => {
      const currentPlayer = Number(ctx.currentPlayer)
      const selectedCard = G.players[currentPlayer].selectedCard
      if (selectedCard === undefined) {
        return INVALID_MOVE
      }
      if (G.players[currentPlayer].blockers.length > 0) {
        return INVALID_MOVE
      }

      if (G.players[currentPlayer].cards[selectedCard].type !== CardType.Path) {
        return INVALID_MOVE
      }
      const card: HandCard[] = G.players[currentPlayer].cards.splice(selectedCard, 1)

      if (card[0].type !== CardType.Path) {
        return INVALID_MOVE
      }
      G.players[currentPlayer].selectedCard = undefined
      G.map.items.push({ card: card[0], coords: { x: x, y: y } })
      const playerCard = G.drawPile.pop()
      if (playerCard !== undefined) {
        G.players[currentPlayer].cards.push(playerCard)
      }
      endTurn(ctx)
    },
    flipCard: (G: GameState, ctx: Ctx) => {
      const currentPlayer = Number(ctx.currentPlayer)
      const selectedCard = G.players[currentPlayer].selectedCard
      if (selectedCard === undefined) {
        return INVALID_MOVE
      }

      const card: HandCard = G.players[currentPlayer].cards[selectedCard]
      if (card.type !== CardType.Path) {
        return INVALID_MOVE
      }

      card.openSides = card.openSides.map(v => flipSide(v))
    },
    blockPlayer: (G: GameState, ctx: Ctx, playerId: number) => {
      const selectedCard = getSelectedCard(G, ctx)

      if (selectedCard === undefined || selectedCard.type !== CardType.Action || selectedCard.action !== Action.Block || selectedCard.blockItems === undefined) {
        return INVALID_MOVE
      }
      G.players[playerId].blockers.push(selectedCard.blockItems[0])
      Play.moves.discardCard(G, ctx)
    },
    unBlockPlayer: (G: GameState, ctx: Ctx, playerId: number) => {
      const selectedCard = getSelectedCard(G, ctx)

      if (selectedCard === undefined || selectedCard.type !== CardType.Action || selectedCard.action !== Action.Unblock || selectedCard.blockItems === undefined) {
        return INVALID_MOVE
      }
      const blockerIndex = G.players[playerId].blockers.findIndex(b => selectedCard.blockItems?.includes(b))
      if (blockerIndex === -1) {
        return INVALID_MOVE
      }
      G.players[playerId].blockers.splice(blockerIndex, 1)
      Play.moves.discardCard(G, ctx)
    },
    peek: (G: GameState, ctx: Ctx, coords: Coordinate) => { },
    destroy: (G: GameState, ctx: Ctx, coords: Coordinate) => { },
  },
}

export default Play
