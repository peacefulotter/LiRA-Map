

const COLORS_PALETTE: string[][] = [
    ['#79d45e', '#f6e683', '#ffaf68', '#f4889a', '#a484e9', '#31bff3']
]


export const getColors = (i: number): string[] => {
    return COLORS_PALETTE[i]
}