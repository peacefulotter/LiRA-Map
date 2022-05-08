
import { Selection } from "d3"
import { FC } from "react"
import { Bounds } from "./path";

// SVG 
export type SVG = d3.Selection<SVGGElement, unknown, null, undefined>
export type SVGLayer = d3.Selection<d3.BaseType, unknown, null, undefined>

// Axis
export interface IAxis { 
    svg: SVG | undefined; 
    axis: GraphAxis | undefined, 
    width: number; 
    height: number; 
}
export type ReactAxis = FC<IAxis>;
export type Axis = d3.ScaleLinear<number, number, never>
export type GraphAxis = [Axis, Axis]

// Data format
export type GraphData =  [number, number, number][]
export interface Plot {
    data: GraphData
    bounds?: Bounds;
    label: string;
}

// Palette - Gradient
export interface PaletteColor { offset: number; color: string; stopValue?: number }
export type Palette = PaletteColor[]
export type Gradient = Selection<SVGStopElement, PaletteColor, SVGLinearGradientElement, unknown>

// MinMax
export type MinMaxAxis = [number, number, number, number]
export type AddMinMaxFunc = (label: string, bounds: Bounds) => void
export type RemMinMaxFunc = (label: string) => void

// Callback
export type D3Callback = (event: any, d: unknown) => void