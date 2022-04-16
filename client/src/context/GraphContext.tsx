import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";
import useMinMaxAxis from "../hooks/useMinMaxAxis";
import { AddMinMaxFunc, Axis, RemMinMaxFunc, SVG } from "../models/graph";


interface ContextProps {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;

    addMinMax: AddMinMaxFunc;
	remMinMax: RemMinMaxFunc;
}

const GraphContext = createContext({} as ContextProps);

export const GraphProvider = ({ children }: any) => {

	const [minMaxAxis, addMinMax, remMinMax] = useMinMaxAxis()

	const [minX, maxX, minY, maxY] = minMaxAxis

	return (
		<GraphContext.Provider
			value={{
				minX, maxX, minY, maxY,
				addMinMax, remMinMax,
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export const useGraph = () => useContext(GraphContext);