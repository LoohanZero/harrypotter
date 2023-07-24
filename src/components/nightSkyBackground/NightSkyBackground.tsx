import React, { useRef, useEffect, useState } from 'react';
import { createStars, drawStars, animateCanvasOnHover, setCanvas } from './nightSkyBackground_helpers';
import { Dot } from './nightSkyBackground';
 
const NightSkyBackground = ({ densityRatio = 0.5, sizeLimit = 5, defaultAlpha = 0.5 }) => {
    const [ dots, setDots] = useState<Dot[]>([]);
    const [ isMouseMoving, setIsMouseMoving] = useState<boolean>(false);
    const [originalDotAmount, setOriginalDotAmount] = useState<number>(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const currentCanvas = canvasRef.current;
        if (currentCanvas) {
            const canvasContext = currentCanvas.getContext('2d');
            

            if (canvasContext) {
                setCanvas(canvasContext)
                const stars = createStars(currentCanvas, densityRatio, sizeLimit, defaultAlpha);
                const starDots = drawStars(currentCanvas, canvasContext, stars);
                setDots(starDots); 
                setOriginalDotAmount(starDots.length);
            }
        }
    }, [])

    useEffect(() => {     
        window.addEventListener('mousemove', (event) => {
            setIsMouseMoving(true)
            animateCanvasOnHover(dots, event, isMouseMoving, setIsMouseMoving, canvasRef?.current?.getContext('2d'), setDots, originalDotAmount)
        })
        
        return () => window.removeEventListener('mousemove', (event) => {
            setIsMouseMoving(false)
            animateCanvasOnHover(dots, event, isMouseMoving, setIsMouseMoving, canvasRef?.current?.getContext('2d'), setDots, originalDotAmount)
        })
    }, [])

    return (
        <>
            <canvas ref={canvasRef} />
        </>)
}

export default NightSkyBackground;