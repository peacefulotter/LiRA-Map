import { Palette } from "../models/graph"
import { PathProperties, PointProperties } from "../models/properties"

export const DEFAULT_WIDTH = 4
export const DEFAULT_WEIGHT = 4
export const DEFAULT_COLOR = 'red'
export const DEFAULT_OPACITY = 1.0
export const DEFAULT_PALETTE: Palette = [
    { offset: 0,    color: "green"  },
    { offset: 0.5,  color: "yellow" },
    { offset: 1,    color: "red"    }
]

export const setProperty = (
    property: keyof PointProperties,
    defaultValue: any,
    pointProperties: PointProperties | undefined, 
    pathProperties: PathProperties
) => {
    return (pointProperties && pointProperties[property]) 
        || pathProperties[property] 
        || defaultValue
}
export const weight = (pointProperties: PointProperties | undefined, pathProperties: PathProperties): number => {
    return setProperty('weight', DEFAULT_WEIGHT, pointProperties, pathProperties)
}

export const opacity = (pointProperties: PointProperties | undefined, pathProperties: PathProperties): number => {
    return setProperty('opacity', DEFAULT_OPACITY, pointProperties, pathProperties)
}

export const color = (pointProperties: PointProperties | undefined, pathProperties: PathProperties): string => {
    return setProperty('color', DEFAULT_COLOR, pointProperties, pathProperties)
}

export const width = (pointProperties: PointProperties | undefined, pathProperties: PathProperties): number => {
    return setProperty('width', DEFAULT_WIDTH, pointProperties, pathProperties)
}

export const fixProperties = (pointProperties: PointProperties | undefined, pathProperties: PathProperties) => {
    return {
        weight: weight(pointProperties, pathProperties),
        opacity: opacity(pointProperties, pathProperties),
        color: color(pointProperties, pathProperties),
        width: width(pointProperties, pathProperties),
    }
}

export const palette = (pathProperties: PathProperties) => pathProperties.palette || DEFAULT_PALETTE