import { FC, ReactElement, ReactNode } from "react";
import { Hotline } from "react-leaflet-hotline";
import { LeafletEvent, LeafletEventHandlerFnMap } from 'leaflet';
import { LatLng } from "./models";
import { Path, Bounds } from "./path";
import { PathProperties, PointProperties, RendererOptions } from "./properties";

export enum RendererName {
    circles = 'circles', 
    rectangles = 'rectangles',
    line = 'line',
    hotline = 'hotline',
    hotcircles = 'hotcircles',
    heatmap = 'heatmap'
}

export type PathEventHandler = (i: number) => (e: LeafletEvent) => void;

export type EventHandlers = {
    [key in keyof LeafletEventHandlerFnMap]: PathEventHandler
};

export interface IRenderer<T> {
    data: T[];
    getLat: (t: T, i: number) => number;
    getLng: (t: T, i: number) => number;
    getVal: (t: T, i: number) => number;
    options: Required<RendererOptions>;
    eventHandlers?: EventHandlers;
}

export type Renderer<T> = FC<IRenderer<T>>;

export interface PathRenderer {
    path: Path;
    properties: PathProperties;
    bounds?: Bounds;
    onClick?: PathEventHandler;
}

export interface PointProps extends LatLng {
	pointProperties: PointProperties | undefined;
	pathProperties: PathProperties;
	onClick: PathEventHandler;
	i: number;
}