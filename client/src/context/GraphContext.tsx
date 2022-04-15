import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";
import useMinMaxAxis from "../hooks/useMinMaxAxis";
import { AddMinMaxFunc, GraphAxis, RemMinMaxFunc, SVG } from "../models/graph";


interface ContextProps {
	svg: SVG | undefined;
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
	gradientId: string;
	axis: GraphAxis | undefined;

	setSVG: Dispatch<SetStateAction<SVG | undefined>>;
    addMinMax: AddMinMaxFunc;
	remMinMax: RemMinMaxFunc;
    setGradientId: Dispatch<SetStateAction<string>>;
    setAxis: Dispatch<SetStateAction<GraphAxis | undefined>>;
}

const GraphContext = createContext({} as ContextProps);

export const GraphProvider = ({ children }: any) => {

	const [svg, setSVG] = useState<SVG>()
	const [axis, setAxis] = useState<GraphAxis>()
	const [minMaxAxis, addMinMax, remMinMax] = useMinMaxAxis()
	const [gradientId, setGradientId] = useState<string>("gradient")

	const [minX, maxX, minY, maxY] = minMaxAxis

	return (
		<GraphContext.Provider
			value={{
				svg,
				axis,
				gradientId,
				minX, maxX, minY, maxY,

				setSVG,
				setAxis,
				setGradientId,
				addMinMax, remMinMax,
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export const useGraph = () => useContext(GraphContext);