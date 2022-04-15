import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";
import useMinMaxAxis from "../hooks/useMinMaxAxis";
import { AddMinMaxFunc, GraphAddFunc, GraphAxis, GraphRemFunc, MinMaxAxis, RemMinMaxFunc, SVG } from "../models/graph";


interface ContextProps {
	svg: SVG | undefined;
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
	gradientId: string;
	axis: GraphAxis | undefined;
	addGraph: GraphAddFunc;
    remGraph: GraphRemFunc;

	setSVG: Dispatch<SetStateAction<SVG | undefined>>;
    addMinMax: AddMinMaxFunc;
	remMinMax: RemMinMaxFunc;
    setGradientId: Dispatch<SetStateAction<string>>;
    setAxis: Dispatch<SetStateAction<GraphAxis | undefined>>;
    setAddGraph: Dispatch<SetStateAction<GraphAddFunc>>;
    setRemGraph: Dispatch<SetStateAction<GraphRemFunc>>;
}

const GraphContext = createContext({} as ContextProps);

export const GraphProvider = ({ children }: any) => {

	const [svg, setSVG] = useState<SVG>()
	const [axis, setAxis] = useState<GraphAxis>()
	const [minMaxAxis, addMinMax, remMinMax] = useMinMaxAxis()
	const [gradientId, setGradientId] = useState<string>("gradient")

	const [addGraph, setAddGraph] = useState<GraphAddFunc>(() => {});
    const [remGraph, setRemGraph] = useState<GraphRemFunc>(() => {});
	
	const [minX, maxX, minY, maxY] = minMaxAxis

	return (
		<GraphContext.Provider
			value={{
				svg,
				axis,
				gradientId,
				minX, maxX, minY, maxY,
				addGraph, remGraph,

				setSVG,
				setAxis,
				setGradientId,
				addMinMax, remMinMax,
				setAddGraph, setRemGraph
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export const useGraph = () => useContext(GraphContext);