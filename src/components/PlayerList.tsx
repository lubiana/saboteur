import React from "react"
import {Ctx} from "boardgame.io"
import Player from "../types/Player"
import GameState from "../types/GameState"
import {Tool, tools} from "../types/Cards"
import {cardSelected} from "../utils/mapHelper"
import {canBlock, canUnblock, selected} from '../utils/cardHelper'
import {isBlockCard, isUnblockCard} from "../types/guards";
import {
  Avatar,
  Badge,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
  Toolbar
} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";

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

const drawPileText = (amount: number): string => "Draw Pile (" + amount + ")"
const discardPileText = (amount: number): string => "Discard Pile (" + amount + ")"

const PlayerList: React.FC<PlayerListProps> = ({G, ctx, moves}) => {
  const classes = useStyles()

  const onToolClick = (index: number, tool: Tool) => {
    const card = selected(G, ctx)

    if (isBlockCard(card)) {
      moves.blockPlayer(index, tool)
    } else if (isUnblockCard(card)) {
      moves.unblockPlayer(index, tool)
    }
  }

  const isActionable = (index: number, tool: Tool) => {
    const player = G.players[index]
    const card = selected(G, ctx)

    return (isBlockCard(card) && canBlock(card, tool, player))
      || (isUnblockCard(card) && canUnblock(card, tool, player))
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
          <Divider/>
          <ListItem
            key="discardpile"
            selected={cardSelected(G, ctx)}
            onClick={() => moves.discardCard(G, ctx)}
          >
            <ListItemText primary={discardPileText(G.discardPile.length)}/>
          </ListItem>
        </List>
        <List>
          {G.players.map((player: Player) => (
            <div key={player.index}>
              <Divider/>
              <ListItem>
                {player.index === Number(ctx.currentPlayer) ? (
                  <ListItemAvatar>
                    <Badge color="primary" overlap="circular" variant="dot">
                      <Avatar>{player.name}</Avatar>
                    </Badge>
                  </ListItemAvatar>
                ) : (
                  <ListItemAvatar>
                    <Avatar>{player.name}</Avatar>
                  </ListItemAvatar>
                )}
                {tools.map(tool =>
                  <Chip
                    key={tool}
                    label={tool}
                    variant={isActionable(player.index, tool) ? "filled" : "outlined"}
                    color={player.blockers[tool] ? "error" : "success"}
                    size="small"
                    onClick={() => isActionable(player.index, tool) && onToolClick(player.index, tool)}
                  />
                )}
              </ListItem>
            </div>
          ))}
        </List>
      </div>
    </Drawer>
  )
}

export default PlayerList
