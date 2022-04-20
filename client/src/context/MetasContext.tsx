import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { RideMeta } from "../models/models";
import { getRides } from "../queries/rides";


interface ContextProps {
	metas: RideMeta[];
	selectedMetas: boolean[];
    setSelectedMetas: Dispatch<SetStateAction<boolean[]>>;
	toggleSelectRide: (i: number, isChecked: boolean) => void
}

const MetasContext = createContext({} as ContextProps);

export const MetasProvider = ({ children }: any) => {

	const [ metas, setMetas ] = useState<RideMeta[]>([]);
    const [ selectedMetas, setSelectedMetas ] = useState<boolean[]>(metas.map(() => false));

    // fetch the metadata of all the rides
    useEffect( () => getRides(setMetas), [] );

    const toggleSelectRide = (i: number, isChecked: boolean) => {   
		console.log(i, isChecked);
		const temp = [...selectedMetas];
		temp[i] = isChecked;
		setSelectedMetas(temp ) 
    }

	return (
		<MetasContext.Provider
			value={{
				metas,
				selectedMetas,
				setSelectedMetas,
				toggleSelectRide
			}}
		>
			{children}
		</MetasContext.Provider>
	);
};

export const useMetasCtx = () => useContext(MetasContext);