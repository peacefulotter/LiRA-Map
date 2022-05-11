
import { createContext, useContext, useState } from "react";
import { RideMeta } from "../models/models";
import { BoundedPath } from "../models/path";
import { RideMeasurement } from "../models/properties";


type MetaPath = {[key: number]: BoundedPath }
type MeasMetaPath = {[key: string]: MetaPath}

interface ContextProps {
	paths: MeasMetaPath;
	addKeyPath: (meas: RideMeasurement, meta: RideMeta, bpath: BoundedPath) => void
	remKeyPath: (meas: RideMeasurement, meta: RideMeta) => void
}

const PathsContext = createContext({} as ContextProps);

const keys = (meas: RideMeasurement, meta: RideMeta) => {
	return { name: meas.name, TaskId: meta.TaskId }
}

export const PathsProvider = ({ children }: any) => {

	const [paths, setPaths] = useState<MeasMetaPath>({})

	const addKeyPath = (meas: RideMeasurement, meta: RideMeta, bpath: BoundedPath) => {
		const { name, TaskId } = keys(meas, meta);

		const temp = {...paths}

		if (!temp.hasOwnProperty(meas.name))
			temp[name] = {}

		temp[name][TaskId] = bpath

		setPaths(temp)

	}

	const remKeyPath = (meas: RideMeasurement, meta: RideMeta) => {
		const { name, TaskId } = keys(meas, meta);
		const temp = {...paths}
		delete temp[name][TaskId]
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