import { gsap } from 'gsap';
import { Dot, Star } from './nightSkyBackground';
import { Dispatch, SetStateAction } from 'react';

const params = {
  maxDistFromCursor: 50,
  dotsSpeed: 0,
  backgroundSpeed: 0
};

const setCanvas = (canvasContext: CanvasRenderingContext2D) => {
  canvasContext.strokeStyle = "white";
	canvasContext.shadowColor = "white";
	canvasContext.shadowBlur = 0;
}

const degToRad = (deg: number) => {
	return deg * (Math.PI / 180);
}

const createStars = (currentCanvas: HTMLCanvasElement, densityRatio = 0.5, sizeLimit = 5, defaultAlpha = 0.5) => {
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
    const VMIN = Math.min(HEIGHT, WIDTH)
    const STAR_COUNT = Math.floor(VMIN * densityRatio)
    const alpha = (Math.floor(Math.random()*10)+1)/10/2;
    currentCanvas.width = WIDTH;
    currentCanvas.height = HEIGHT
    
    return new Array(STAR_COUNT).fill(0).map((_, index) => ({
        id: index,
        x: gsap.utils.random(0, WIDTH, 1),
        y: gsap.utils.random(0, HEIGHT, 1),
        alpha: defaultAlpha,
        size: gsap.utils.random(1, sizeLimit, 1),
        radius: Math.floor(Math.random() * 1) + 1,
        color: `rgba(255,255,255, ${alpha})`,
      }))
}

const drawStar = (star: Star | Dot, canvasContext: CanvasRenderingContext2D) => {
  canvasContext.fillStyle = star.color;
  canvasContext.shadowBlur = star.radius * 2;
  canvasContext.beginPath()
  canvasContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false)
  canvasContext.closePath();
  canvasContext.fill()
}

const createBasicDot = (star: Star) => {
  const alpha = .5;
  return {
    id: star.id,
  x: star.x,
  y: star.y,
  radius: Math.floor(Math.random() * 3) + 1,
  color: `rgba(255,255,255, ${alpha})`,
  alpha: alpha,
  alphaReduction: .005 ,
  linkColor: `rgba(255,255,255, ${alpha / 4})`
}
}

const createDot = (star: Star , canvasContext: CanvasRenderingContext2D) => {
    const basicDot = createBasicDot(star);
    const dot = {
      maxLinks: 2,
      speed: .5,
      dir: Math.floor(Math.random() * 140) + 200
    }
    const completeDot = {...dot, ...basicDot}
    drawStar(completeDot, canvasContext);
    return completeDot;
}

const drawStars = (currentCanvas: HTMLCanvasElement, canvasContext: CanvasRenderingContext2D, stars: Star[]) => {
  canvasContext.clearRect(
      0,
      0,
      currentCanvas.width,
      currentCanvas.height 
    )
    const dots = stars.map((star: Star) => {
      drawStar(star, canvasContext)
      return createDot(star, canvasContext)
      })

      return dots;
  }

  
  const slowlyKillDot = (dots: Dot[], dot: Dot, originalDotAmount: number) => {
    if(dot.id > originalDotAmount) {
      dot.alpha = dot.alpha - dot.alphaReduction

      if (dot.alpha <= 0) {
        console.log(dot.alpha <=0);
        console.log('KILLING DOT', dot.alpha <=0, dot.id, dots.length)
       // delete dots[dot.id];

        return dots;
      }

      const newDot = {
        ...dot, 
        alpha: dot.alpha,
        color: `rgba(255,255,255, ${dot.alpha})`, 
        linkColor: `rgba(255,255,255, ${dot.alpha / 4})`, 
        x: dot.x + Math.cos(degToRad(dot.dir))*(dot.speed+ params.dotsSpeed/100), 
        y: dot.y + Math.sin(degToRad(dot.dir))*(dot.speed+ params.dotsSpeed/100)}
    
        dots.splice(dot.id, 1, newDot);
  
        return [...dots, newDot];
    }
     
    return [...dots, dot];
  }

  const moveDots = (dots: Dot[], dot: Dot, canvasContext: CanvasRenderingContext2D) => {
    createDot(dot, canvasContext);
    linkDots(dots, dot, canvasContext)

    const newDot = {...dot, 
      x: dot.x + Math.cos(degToRad(dot.dir))*(dot.speed+ params.dotsSpeed/100), 
      y: dot.y + Math.sin(degToRad(dot.dir))*(dot.speed+ params.dotsSpeed/100)
    }
  
    dots.splice(dot.id, 1, newDot);

    return dots;
  }

  const getPreviousDot = (stepback: number, dots: Dot[]): Dot | null => {
    const id = dots?.length;
    if (id == 0 || id - stepback < 0) return null;
    if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
    else return null;
  }

  const linkDots = (dots: Dot[], dot: Dot, canvasContext: CanvasRenderingContext2D) => {
    if (dot.id == 0) return;
    const previousDot1 = getPreviousDot(1, dots);
    const previousDot2 = getPreviousDot(2, dots);
    const previousDot3 = getPreviousDot(3, dots);
    if (!previousDot1) return;

    if(!dot?.linkColor) return;
    canvasContext.strokeStyle = dot.linkColor;
    canvasContext.moveTo(previousDot1.x, previousDot1.y);
    canvasContext.beginPath();
    canvasContext.lineTo(dot.x, dot.y);

    if (previousDot2) canvasContext.lineTo(previousDot2.x, previousDot2.y);
    if (previousDot3) canvasContext.lineTo(previousDot3.x, previousDot3.y);
    canvasContext.stroke();
    canvasContext.closePath();
  }

  const animateCanvasOnHover = (
    dots: Dot[], 
    event: { clientX: number; clientY: number; }, 
    isMouseMoving: boolean, 
    setIsMouseMoving: Dispatch<SetStateAction<boolean>>,
    canvasContext: CanvasRenderingContext2D | null | undefined, 
    setDots: Dispatch<SetStateAction<Dot[]>>,
    originalDotAmount: number) => {
    if(!canvasContext) return
    const dotsMinDist = 2;
	  const mouseX = event.clientX;
	  const mouseY = event.clientY;
    const mouseMoveChecker = setTimeout(() => setIsMouseMoving(false), 100);
    clearInterval(mouseMoveChecker);
	
    if (!isMouseMoving) return;
  
    if (dots?.length === 0) {
      const dot = {
          id: 0,
          x: mouseX,
          y: mouseY,
          color: `rgba(255,255,255, 0.5)`,
          radius: Math.floor(Math.random() * 3) + 1,
      }
      dots[0] = createDot(dot, canvasContext)
      return;
    }

  
	const previousDot = getPreviousDot(1, dots);

  if(!previousDot) return;
  
	const prevX = previousDot.x; 
	const prevY = previousDot.y; 

	const diffX = Math.abs(prevX - mouseX);
	const diffY = Math.abs(prevY - mouseY);

	if (diffX < dotsMinDist || diffY < dotsMinDist) return;
   
	let xVariation = Math.random() > .5 ? -1 : 1;
	xVariation = xVariation * Math.floor(Math.random() * params.maxDistFromCursor) + 1;
	let yVariation = Math.random() > .5 ? -1 : 1;
	yVariation = yVariation * Math.floor(Math.random() * params.maxDistFromCursor) + 1;

  const lastDot = dots[dots.length - 1]
  
	const newDot = { ...lastDot, id: lastDot.id + 1,  x: mouseX + xVariation, y: mouseY + yVariation};

  dots[dots.length] = createDot(newDot, canvasContext );
  let newDots = dots.reduce((dots: Dot[], dot: Dot) => slowlyKillDot(dots, dot, originalDotAmount), []);
 
  moveDots(newDots, lastDot, canvasContext);
  console.log(dots, newDots);
  setDots(newDots);
  // window.requestAnimationFrame(() => animateCanvasOnHover(
  //   dots, 
  //   event, 
  //   isMouseMoving, 
  //   setIsMouseMoving,
  //   canvasContext, 
  //   setDots,
  //   originalDotAmount ))
  }




  export { createStars, createDot, drawStars, animateCanvasOnHover, setCanvas };