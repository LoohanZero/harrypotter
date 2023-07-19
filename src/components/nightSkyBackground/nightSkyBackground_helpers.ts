import { gsap } from 'gsap';
import { Dot, Star } from './nightSkyBackground';
import { v4 as uuidv4 } from 'uuid';

const setCanvas = (canvasContext: CanvasRenderingContext2D) => {
  canvasContext.fillStyle = 'yellow'
  canvasContext.beginPath()
  canvasContext.arc(
      window.innerWidth / 2, // X
      window.innerHeight / 2, // Y
      100, // Radius
      0, // Start Angle (Radians)
      Math.PI * 2 // End Angle (Radians)
  )
  canvasContext.fill()
}

const createStars = (currentCanvas: HTMLCanvasElement, densityRatio = 0.5, sizeLimit = 5, defaultAlpha = 0.5) => {
    const VMIN = Math.min(window.innerHeight, window.innerWidth)
    const STAR_COUNT = Math.floor(VMIN * densityRatio)
    const alpha = (Math.floor(Math.random()*10)+1)/10/2;
    currentCanvas.width = window.innerWidth
    currentCanvas.height = window.innerHeight
    
    return new Array(STAR_COUNT).fill(0).map(() => ({
        id: uuidv4(),
        x: gsap.utils.random(0, window.innerWidth, 1),
        y: gsap.utils.random(0, window.innerHeight, 1),
        size: gsap.utils.random(1, sizeLimit, 1),
        radius: Math.floor(Math.random() * 1) + 1,
        color: `rgba(255,255,255, ${alpha})`,
      }))
}

const drawStar = (star: Star | Dot, context: CanvasRenderingContext2D) => {
  context.fillStyle = star.color;
  context.shadowBlur = star.radius * 2;
  context.beginPath()
  context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false)
  context.closePath();
  context.fill()
}

const createDot = (currentCanvas: HTMLCanvasElement, context: CanvasRenderingContext2D, star: Star) => {
    const id = uuidv4();
    const alpha = .3;

    const dot = {
      id: id,
      x: star.x,
      y: star.y,
      radius: Math.floor(Math.random()*3)+1,
      maxLinks: 2,
      speed: .5,
      alpha: alpha,
      alphaReduction: .005,
      color: `rgba(255,255,255, ${alpha})`,
      linkColor: `rgba(255,255,255, ${alpha / 4})`,
      dir: Math.floor(Math.random()*140)+200
    }

    drawStar(dot, context);

    return dot;
}

const drawStars = (currentCanvas: HTMLCanvasElement, context: CanvasRenderingContext2D, stars: Star[]) => {
    context.clearRect(
      0,
      0,
      currentCanvas.width,
      currentCanvas.height
    )
    stars.forEach((star: Star) => drawStar(star, context))
  }

  const moveStars = () => {

  }
  export { createStars, createDot, drawStars, moveStars, setCanvas };