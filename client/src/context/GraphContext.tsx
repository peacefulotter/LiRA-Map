import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useRef,
	useState,
} from "react";
import useMinMaxAxis from "../hooks/useMinMaxAxis";
import { AddMinMaxFunc, DotHover, RemMinMaxFunc } from "../assets/graph/types";


interface ContextProps {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;

    addBounds: AddMinMaxFunc;
	remBounds: RemMinMaxFunc;

	dotHover: DotHover | undefined;
	setDotHover: Dispatch<SetStateAction<DotHover | undefined>>;
}

const GraphContext = createContext({} as ContextProps);

export const GraphProvider = ({ children }: any) => {

	const { bounds, addBounds, remBounds } = useMinMaxAxis()
	const [dotHover, setDotHover] = useState<DotHover>()

	const { minX, maxX, minY, maxY } = bounds;

	return (
		<GraphContext.Provider
			value={{
				minX, maxX, minY, maxY,
				addBounds, remBounds,
				dotHover, setDotHover
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export const useGraph = () => useContext(GraphContext);