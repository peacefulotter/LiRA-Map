import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
} from "react";

import useMeasurements from "../Components/Map/Measurements";
import { RideMeasurement } from "../models/properties";

interface ContextProps {
	measurements: RideMeasurement[];
    setMeasurements: Dispatch<SetStateAction<RideMeasurement[]>>;
}

const MeasurementsContext = createContext({} as ContextProps);

export const MeasurementsProvider = ({ children }: any) => {

    const [ measurements, setMeasurements ] = useMeasurements();

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