

const COLORS_PALETTE: string[][] = [
    ['#79d45e', '#f6e683', '#ffaf68', '#f4889a', '#a484e9', '#31bff3']
    // add more palettes?
]


export const getColor = (paletteIndex: number, n: number): string => {
    const palette = COLORS_PALETTE[paletteIndex]
    return palette[n % palette.length]
}