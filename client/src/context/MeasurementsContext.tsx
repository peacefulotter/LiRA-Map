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
	selectedMeasurements: RideMeasurement[];
}

const MeasurementsContext = createContext({} as ContextProps);

export const MeasurementsProvider = ({ children }: any) => {

	const [ measurements, setMeasurements ] = useState<RideMeasurement[]>([])
	const [ selectedMeasurements, setSelectedMeasurements ] = useState<RideMeasurement[]>([])

	useEffect( () => setSelectedMeasurements( measurements.filter(m => m.isActive)), [measurements] )

	useEffect( () => getMeasurements(setMeasurements), [] )

	return (
		<MeasurementsContext.Provider
			value={{
				measurements,
				setMeasurements,
				selectedMeasurements
			}}
		>
			{children}
		</MeasurementsContext.Provider>
	);
};

export const useMeasurementsCtx = () => useContext(MeasurementsContext);