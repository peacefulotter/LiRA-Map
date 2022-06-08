import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useRef,
	useState,
} from "react";
import useMinMaxAxis from "../hooks/useMinMaxAxis";
import { AddMinMaxFunc, DotHover, RemMinMaxFunc } from "../models/graph";


interface ContextProps {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;

    addMinMax: AddMinMaxFunc;
	remMinMax: RemMinMaxFunc;

	dotHover: DotHover | undefined;
	setDotHover: Dispatch<SetStateAction<DotHover | undefined>>;
}

const GraphContext = createContext({} as ContextProps);

export const GraphProvider = ({ children }: any) => {

	const [minMaxAxis, addMinMax, remMinMax] = useMinMaxAxis()
	const [dotHover, setDotHover] = useState<DotHover>()

	const [minX, maxX, minY, maxY] = minMaxAxis

	return (
		<GraphContext.Provider
			value={{
				minX, maxX, minY, maxY,
				addMinMax, remMinMax,
				dotHover, setDotHover
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export const useGraph = () => useContext(GraphContext);