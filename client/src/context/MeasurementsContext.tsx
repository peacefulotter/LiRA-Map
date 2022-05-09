import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

import { RideMeasurement } from "../models/properties";
import { getMeasurements } from "../queries/measurements";

interface ContextProps {
	measurements: RideMeasurement[];
    setMeasurements: Dispatch<SetStateAction<RideMeasurement[]>>;
}

const MeasurementsContext = createContext({} as ContextProps);

export const MeasurementsProvider = ({ children }: any) => {

	const [ measurements, setMeasurements ] = useState<RideMeasurement[]>([])

	useEffect( () => getMeasurements(setMeasurements), [] )

	return (
		<MeasurementsContext.Provider
			value={{
				measurements,
				setMeasurements
			}}
		>
			{children}
		</MeasurementsContext.Provider>
	);
};

export const useMeasurementsCtx = () => useContext(MeasurementsContext);