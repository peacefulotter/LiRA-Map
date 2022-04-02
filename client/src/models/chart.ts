import { Path } from "./path";

export interface ChartPoint {
	x: number;
	y: number;
}

export type ChartData = ChartPoint[]

export type ChartAddFunc = (dataName: string, data: Path, minTime?: number) => void
export type ChartRemFunc = (dataName: string) => void