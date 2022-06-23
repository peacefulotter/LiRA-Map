import { Palette } from "../../models/graph";
import { HotlineOptions } from "./hotline";



export const defaultHotlinePalette: Palette = [
    { r: 0,   g: 160, b: 0,  t: 0    },
    { r: 255, g: 255, b: 0,  t: 0.5  },
    { r: 255, g: 0,   b: 0,  t: 1    },
]

export const defaultHotlineOptions: Required<HotlineOptions> = {
    min: 0,
    max: 1,
    outlineWidth: 1,
    outlineColor: 'black',
    weight: 5,
    palette: defaultHotlinePalette,
    onclick: () => {}
}