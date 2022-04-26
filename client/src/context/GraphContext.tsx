import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
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

	dotHoverIndex: number | undefined;
	setDotHoverIndex: Dispatch<SetStateAction<number | undefined>>;
}

const GraphContext = createContext({} as ContextProps);

export const GraphProvider = ({ children }: any) => {

	const [minMaxAxis, addMinMax, remMinMax] = useMinMaxAxis()
	const [dotHoverIndex, setDotHoverIndex] = useState<number>()

	const [minX, maxX, minY, maxY] = minMaxAxis

	useEffect(() => console.log('here'), [dotHoverIndex])

	return (
		<GraphContext.Provider
			value={{
				minX, maxX, minY, maxY,
				addMinMax, remMinMax,
				dotHoverIndex, setDotHoverIndex
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export const useGraph = () => useContext(GraphContext);