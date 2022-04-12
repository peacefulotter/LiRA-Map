
import { Selection } from "d3"
import { JSONProps, PointData } from "./path"

export type SVG = d3.Selection<SVGGElement, unknown, null, undefined>
export type Axis = d3.ScaleLinear<number, number, never>
export type SVGLayer = d3.Selection<d3.BaseType, unknown, null, undefined>


export type GraphData =  [number, number][]

export type GraphAddFunc = (pathProps: JSONProps, x: (p: PointData) => number) => void
export type GraphRemFunc = (pathProps: JSONProps) => void

export interface PaletteColor { offset: string; color: string; }
export type Palette = PaletteColor[]
export type Gradient = Selection<SVGStopElement, PaletteColor, SVGLinearGradientElement, unknown>
