import React from "react"
import Drawer from "@material-ui/core/Drawer"
import Toolbar from "@material-ui/core/Toolbar"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import {Ctx} from "boardgame.io"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"
import Divider from "@material-ui/core/Divider"
import Player from "../types/Player"
import GameState from "../types/GameState"
import {Tool} from "../types/Cards"
import {cardSelected} from "../utils/mapHelper"
import {selected} from '../utils/cardHelper'
import {isBlockCard, isToolActionCard, isUnblockCard} from "../types/guards";

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
  })
)

interface PlayerListProps {
  G: GameState
  ctx: Ctx
  moves: any
}

const drawPileText = (amount: number): string => "Drawpile (" + amount + ")"

const discardPileText = (amount: number): string => "Discardpile (" + amount + ")"

const canClick = (G: GameState, ctx: Ctx): boolean =>
  isToolActionCard(selected(G, ctx))

const playerText = (player: Player): string => {
  let output: string = player.name
  const items = [
    {l: "P", b: "Pickaxe"},
    {l: "C", b: "Cart"},
    {l: "L", b: "Lamp"},
  ]

  items.forEach((item: any) => {
    const amount: number = player.blockers.filter((blocker: Tool) => blocker === item.b).length
    output = output.concat(` (${item.l}:${amount.toString()})`)
  })

  return output
}

const PlayerList: React.FC<PlayerListProps> = ({G, ctx, moves}) => {
  const classes = useStyles()

  const playerClick = (G: GameState, ctx: Ctx, index: number) => {
    const card = selected(G, ctx)
    if (isBlockCard(card)) {
      moves.blockPlayer(index)
    } else if (isUnblockCard(card)) {
      moves.unblockPlayer(index)
    }
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar/>
      <div className={classes.drawerContainer}>
        <List>
          <ListItem key="drawpile">
            <ListItemText primary={drawPileText(G.drawPile.length)}/>
          </ListItem>
          <ListItem
            key="discardpile"
            selected={cardSelected(G, ctx)}
            onClick={
              cardSelected(G, ctx)
                ? () => {
                  moves.discardCard(G, ctx)
                }
                : undefined
            }
          >
            <ListItemText primary={discardPileText(G.discardPile.length)}/>
          </ListItem>
        </List>
        <List>
          <Divider/>
          {G.players.map((player: Player, index: number) => (
            <ListItem
              key={index}
              selected={index === Number(ctx.currentPlayer) || canClick(G, ctx)}
              onClick={
                canClick(G, ctx)
                  ? () => playerClick(G, ctx, index)
                  : undefined
              }
            >
              <ListItemText primary={playerText(player)}/>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  )
}

export default PlayerList
