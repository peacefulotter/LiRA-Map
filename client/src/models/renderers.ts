import { FC } from "react";
import { LatLng } from "./models";
import { Path, Bounds } from "./path";
import { PathProperties, PointProperties } from "./properties";

export enum RendererName {
    circle = 'circle',
    circles = 'circles', 
    rectangles = 'rectangles',
    line = 'line',
    hotline = 'hotline',
    hotpoints = 'hotpoints'
}

export interface RendererProps {
    path: Path;
    bounds?: Bounds;
    properties: PathProperties;
    onClick: PathEventHandler;
}

export interface PointProps extends LatLng {
	pointProperties: PointProperties | undefined;
	pathProperties: PathProperties;
	onClick: PathEventHandler;
	i: number;
}

export type PathEventHandler = (i: number) => (e: any) => void;

export type Renderer = FC<RendererProps>
