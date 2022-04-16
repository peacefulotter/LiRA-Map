
import { createContext, useContext, useState } from "react";
import { RideMeta } from "../models/models";
import { DataPath } from "../models/path";
import { RideMeasurement } from "../models/properties";


type MetaPath = {[key: number]: DataPath }
type MeasMetaPath = {[key: string]: MetaPath}

interface ContextProps {
	paths: MeasMetaPath;
	addKeyPath: (meas: RideMeasurement, meta: RideMeta, path: DataPath) => void
	remKeyPath: (meas: RideMeasurement, meta: RideMeta) => void
}

const PathsContext = createContext({} as ContextProps);

export const PathsProvider = ({ children }: any) => {

	const [paths, setPaths] = useState<MeasMetaPath>({})

	const keys = (meas: RideMeasurement, meta: RideMeta) => {
		return { name: meas.name, TaskId: meta.TaskId }
	}

	const addKeyPath = (meas: RideMeasurement, meta: RideMeta, path: DataPath) => {
		const { name, TaskId } = keys(meas, meta);

		const temp = {...paths}

		console.log('BEFORE adding', temp);

		if (!temp.hasOwnProperty(meas.name))
			temp[name] = {}

		temp[name][TaskId] = path

		console.log('AFTER adding', temp);
		

		setPaths(temp)
	}

	const remKeyPath = (meas: RideMeasurement, meta: RideMeta) => {
		const { name, TaskId } = keys(meas, meta);
		const temp = {...paths}
		console.log('BEFORE adding', temp);
		delete temp[name][TaskId]
		console.log('AFTER adding', temp);
		setPaths(temp)
	}

	return (
		<PathsContext.Provider
			value={{
				paths, addKeyPath, remKeyPath
			}}
		>
			{children}
		</PathsContext.Provider>
	);
};

export const useKeyPaths = () => useContext(PathsContext);