import React, { useEffect, useRef } from "react"
import { CardType, MapTile, OpenSide, EndTile } from "../types/Cards"

interface MapTileCanvasProps {
  card: MapTile | EndTile
}

const drawForNormal = (ctx: CanvasRenderingContext2D, side: OpenSide): void => {
  switch (side) {
    case OpenSide.Left:
      ctx.fillRect(0, 30, 25, 10)
      break
    case OpenSide.Right:
      ctx.fillRect(25, 30, 25, 10)
      break
    case OpenSide.Down:
      ctx.fillRect(20, 30, 10, 40)
      break
    case OpenSide.Up:
      ctx.fillRect(20, 0, 10, 40)
      break
    default:
      break
  }
}

const drawForDeadEnd = (ctx: CanvasRenderingContext2D, side: OpenSide): void => {
  switch (side) {
    case OpenSide.Left:
      ctx.fillRect(0, 30, 10, 10)
      break
    case OpenSide.Right:
      ctx.fillRect(40, 30, 10, 10)
      break
    case OpenSide.Down:
      ctx.fillRect(20, 60, 10, 10)
      break
    case OpenSide.Up:
      ctx.fillRect(20, 0, 10, 10)
      break
    default:
      break
  }
}

const drawEndCard = (ctx: CanvasRenderingContext2D, card: EndTile) => {
  ctx.fillStyle = "#000"
  if (!card.uncovered) {
    ctx.strokeRect(20, 30, 10, 10)
    return
  }
  ctx.fillStyle = card.gold ? "#f90" : "#000"
  ctx.fillRect(20, 30, 10, 10)
}

const MapTileCanvas: React.FC<MapTileCanvasProps> = ({ card }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) {
      return
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.fillStyle = card.type === CardType.Path ? "#000" : "#060"
    if ("openSides" in card && card.type !== CardType.End) {
      card.openSides.forEach((side: OpenSide) => {
        if (card.deadEnd === true) {
          drawForDeadEnd(context, side)
        } else {
          drawForNormal(context, side)
        }
      })
    }
    if (card.type === CardType.End && "gold" in card && "uncovered" in card) {
      drawEndCard(context, card)
    }
  })
  return <canvas width="50" height="70" style={{ width: "50px", height: "70px" }} ref={canvasRef} />
}

export default MapTileCanvas
