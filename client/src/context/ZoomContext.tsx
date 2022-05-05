import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";


interface ContextProps {
	zoom: number;
	setZoom: Dispatch<SetStateAction<number>>
}

const ZoomContext = createContext({} as ContextProps);

export const ZoomProvider = ({ children }: any) => {

	const [zoom, setZoom] = useState<number>(0)

	return (
		<ZoomContext.Provider
			value={{zoom, setZoom}}
		>
			{children}
		</ZoomContext.Provider>
	);
};

export const useZoom = () => useContext(ZoomContext);