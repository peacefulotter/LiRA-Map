import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { GraphAddFunc, GraphRemFunc } from "../models/graph";


interface ContextProps {
	addGraph: GraphAddFunc;
    remGraph: GraphRemFunc;
    setAddGraph: Dispatch<SetStateAction<GraphAddFunc>>;
    setRemGraph: Dispatch<SetStateAction<GraphRemFunc>>;
}

const GraphContext = createContext({} as ContextProps);

export const GraphProvider = ({ children }: any) => {

	const [addGraph, setAddGraph] = useState<GraphAddFunc>(() => {});
    const [remGraph, setRemGraph] = useState<GraphRemFunc>(() => {});

	return (
		<GraphContext.Provider
			value={{
				addGraph,
				remGraph,
				setAddGraph,
				setRemGraph
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export const useGraph = () => useContext(GraphContext);