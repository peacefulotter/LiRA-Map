import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { Segment } from "../models/segment";
import { SegTypes } from "../pages/CarData";


const DEFAULT_TYPES: SegTypes = {
	dataType: undefined,
	aggrType: undefined,
	direction: undefined
}

interface ContextProps {
	// Path
	pathTypes: SegTypes
	setPathTypes: Dispatch<SetStateAction<SegTypes>>
	pathDirection: number;
	setPathDirection: Dispatch<SetStateAction<number>>;

	// Segment
	segment: Segment | undefined;
	setSegment: Dispatch<SetStateAction<Segment | undefined>>;
	segTypes: SegTypes;
	setSegTypes: Dispatch<SetStateAction<SegTypes>>;
	segDirection: number;
	setSegDirection: Dispatch<SetStateAction<number>>;
}

const SegmentContext = createContext({} as ContextProps);

export const SegmentProvider = ({ children }: any) => {

	// Path
	const [pathTypes, setPathTypes] = useState<SegTypes>(DEFAULT_TYPES)
	const [pathDirection, setPathDirection] = useState<number>(0)

	// Segment
	const [segment, setSegment] = useState<Segment>()
	const [segTypes,  setSegTypes]  = useState<SegTypes>(DEFAULT_TYPES)
	const [segDirection, setSegDirection] = useState<number>(0)


	return (
		<SegmentContext.Provider
			value={{
				pathTypes, setPathTypes, pathDirection, setPathDirection,
				segment, setSegment,
				segTypes,  setSegTypes,  segDirection,  setSegDirection
			}}
		>
			{children}
		</SegmentContext.Provider>
	);
};

export const useSegment = () => useContext(SegmentContext);