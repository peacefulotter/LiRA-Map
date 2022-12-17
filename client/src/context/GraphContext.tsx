import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import useMinMaxAxis from '../hooks/useMinMaxAxis';
import {
  AddMinMaxFunc,
  DotHover,
  MarkersRecord,
  RemMinMaxFunc,
  UseMarkersAction,
} from '../assets/graph/types';
import { Bounds, MeasMetaPath } from '../models/path';
import { getRide } from '../queries/rides';
import useToast from '../Components/createToast';
import { useMetasCtx } from './MetasContext';
import { useMeasurementsCtx } from './MeasurementsContext';
import Loading from '../Components/Loading';
import { ActiveMeasProperties } from '../models/properties';

// @author Benjamin Lumbye s204428, Matteo Hoffmann s222952
interface ContextProps {
  markers: MarkersRecord;
  useMarkers: Dispatch<UseMarkersAction>;
  lastMarkersAction: UseMarkersAction | undefined;

  paths: MeasMetaPath;

  selectedMeasurementName: string | undefined;
  setSelectedMeasurementName: Dispatch<SetStateAction<string | undefined>>;
  selectedTaskID: number | undefined;
  setSelectedTaskID: Dispatch<SetStateAction<number | undefined>>;
  selectedMeasurementBounds: Bounds | undefined;
  selectedMeasurement: ActiveMeasProperties | undefined;
}

const GraphContext = createContext({} as ContextProps);

export const GraphProvider = ({ children }: any) => {
  const [lastMarkersAction, setLastMarkersAction] =
    useState<UseMarkersAction>();
  const [markers, useMarkers] = useReducer(
    (state: MarkersRecord, action: UseMarkersAction) => {
      // If the data already is as requested then don't update
      const existingMarker =
        state[`${action.taskID}-${action.measurementName}`];
      if (
        existingMarker &&
        existingMarker.lat === action.data.lat &&
        existingMarker.lng === action.data.lng &&
        existingMarker.index === action.data.index
      )
        return state;
      const newState = { ...state };
      newState[`${action.taskID}-${action.measurementName}`] = action.data;
      setLastMarkersAction(action);
      return newState;
    },
    {},
  );

  const { selectedMetas } = useMetasCtx();
  const { selectedMeasurements } = useMeasurementsCtx();

  const [paths, setPaths] = useState<MeasMetaPath>({});
  const [selectedTaskID, setSelectedTaskID] = useState<number>();
  const [selectedMeasurementName, setSelectedMeasurementName] =
    useState<string>();
  const [loading, setLoading] = useState(false);

  const updatePaths = async () => {
    setLoading(true);
    const temp = {} as MeasMetaPath;

    for (const meas of selectedMeasurements) {
      const { name } = meas;
      temp[name] = {};

      for (const meta of selectedMetas) {
        const { TaskId } = meta;

        if (Object.hasOwn(paths, name) && Object.hasOwn(paths[name], TaskId))
          temp[name][TaskId] = paths[name][TaskId];
        else {
          const bp = await getRide(meas, meta, useToast);
          if (bp !== undefined) temp[name][TaskId] = bp;
        }
      }
    }

    setLoading(false);
    return temp;
  };

  useEffect(() => {
    // Checks if the selected graph is no longer present - if it isn't then set it to something that is there
    if (
      selectedMetas.length > 0 &&
      !selectedMetas.some((meta) => meta.TaskId === selectedTaskID)
    ) {
      setSelectedTaskID(selectedMetas[0].TaskId);
    } else if (selectedMetas.length === 0) {
      setSelectedTaskID(undefined);
    }
    if (
      selectedMeasurements.length > 0 &&
      !selectedMeasurements.some(
        (meas) => meas.name === selectedMeasurementName,
      )
    ) {
      setSelectedMeasurementName(selectedMeasurements[0].name);
    } else if (selectedMeasurements.length === 0) {
      setSelectedMeasurementName(undefined);
    }

    updatePaths().then(setPaths);
  }, [selectedMetas, selectedMeasurements]);

  // Calculates the correct bounds for all paths - this should probably be completely refactored as bound are no longer properly used
  const selectedMeasurementBounds: Bounds | undefined = useMemo(() => {
    if (
      selectedMetas.length > 0 &&
      selectedMeasurementName &&
      paths[selectedMeasurementName]
    ) {
      const temp = paths[selectedMeasurementName];
      const minY = Math.min(
        ...(Object.keys(temp).map((k) => temp[+k].bounds?.minY) as number[]),
      );
      const maxY = Math.max(
        ...(Object.keys(temp).map((k) => temp[+k].bounds?.maxY) as number[]),
      );
      return { minY: minY, maxY: maxY };
    } else {
      return selectedMeasurementBounds;
    }
  }, [paths, selectedMeasurementName]);

  const selectedMeasurement = useMemo(
    () =>
      selectedMeasurements.find(
        (meas) => meas.name === selectedMeasurementName,
      ),
    [selectedMeasurements, selectedMeasurementName],
  );

  return (
    <GraphContext.Provider
      value={{
        markers,
        useMarkers,
        lastMarkersAction,
        paths,
        selectedMeasurementName,
        setSelectedMeasurementName,
        selectedTaskID,
        setSelectedTaskID,
        selectedMeasurementBounds,
        selectedMeasurement,
      }}
    >
      {children}
      <Loading loading={loading} />
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);
