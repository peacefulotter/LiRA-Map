
import { Selection } from "d3"

// SVG 
export type SVG = d3.Selection<SVGGElement, unknown, null, undefined>
export type SVGLayer = d3.Selection<d3.BaseType, unknown, null, undefined>

// Axis
export type Axis = d3.ScaleLinear<number, number, never>
export type GraphAxis = [Axis, Axis]

// Data format
export type GraphData =  [number, number][]

// Palette - Gradient
export interface PaletteColor { offset: string; color: string; stopValue?: number }
export type Palette = PaletteColor[]
export type Gradient = Selection<SVGStopElement, PaletteColor, SVGLinearGradientElement, unknown>

// MinMax
export type MinMaxAxis = [number, number, number, number]
export type AddMinMaxFunc = (label: string, _minX?: number, _maxX?: number, _minY?: number, _maxY?: number) => void
export type RemMinMaxFunc = (label: string) => void

// Callback
export type D3Callback = (event: any, d: unknown) => void