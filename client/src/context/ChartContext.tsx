import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { ChartAddFunc, ChartRemFunc } from "../models/chart";


interface ContextProps {
	addChartData: ChartAddFunc;
    remChartData: ChartRemFunc;
    setAddChartData: Dispatch<SetStateAction<ChartAddFunc>>;
    setRemChartData: Dispatch<SetStateAction<ChartRemFunc>>;
}

const ChartContext = createContext({} as ContextProps);

export const ChartProvider = ({ children }: any) => {

	const [addChartData, setAddChartData] = useState<ChartAddFunc>(() => {});
    const [remChartData, setRemChartData] = useState<ChartRemFunc>(() => {});

	return (
		<ChartContext.Provider
			value={{
				addChartData,
				remChartData,
				setAddChartData,
				setRemChartData
			}}
		>
			{children}
		</ChartContext.Provider>
	);
};

export const useChartCtx = () => useContext(ChartContext);