import React, { useRef, useEffect } from 'react';
import { createStars, drawStars, moveStars, setCanvas, getCanvasContext } from './nightSkyBackground_helpers';

const NightSkyBackground = ({ densityRatio = 0.5, sizeLimit = 5, defaultAlpha = 0.5 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const currentCanvas = canvasRef.current;
        if (currentCanvas) {
            const canvasContext = getCanvasContext(currentCanvas)

            if (canvasContext) {
                setCanvas(canvasContext)
                const stars = createStars(currentCanvas, densityRatio, sizeLimit, defaultAlpha);
                drawStars(currentCanvas, canvasContext, stars);
                moveStars()
            }
        }
    }, [])

    return (
        <>
            <canvas ref={canvasRef} />
        </>)
}

export default NightSkyBackground;