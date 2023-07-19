interface Star {
    x: number,
    y: number,
    size?: number,
    radius: number,
    color: string
}

interface Dot extends Star {
    maxLinks: number,
	speed: number,
    alpha: number,
	alphaReduction: number,
	linkColor: string,
    dir: number
}
export type { Star, Dot };