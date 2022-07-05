


const getColor = (val: number, defaultColor: string | undefined, i: number): string => {
    if ( val < 0 )
        return defaultColor || 'orange';

    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
}

export default getColor;