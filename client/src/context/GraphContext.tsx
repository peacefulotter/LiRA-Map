import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
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
import { MeasMetaPath } from '../models/path';
import { getRide } from '../queries/rides';
import useToast from '../Components/createToast';
import { useMetasCtx } from './MetasContext';
import { useMeasurementsCtx } from './MeasurementsContext';

interface ContextProps {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;

  addBounds: AddMinMaxFunc;
  remBounds: RemMinMaxFunc;

  dotHover: DotHover | undefined;
  setDotHover: Dispatch<SetStateAction<DotHover | undefined>>;
  markers: MarkersRecord;
  useMarkers: Dispatch<UseMarkersAction>;
  lastMarkersAction: UseMarkersAction | undefined;

  paths: MeasMetaPath;
}

const GraphContext = createContext({} as ContextProps);

// TODO: remove bounds / refactor?  -> is it needed really?
// TODO: generalize DotHover into an "Event State" (to support for more events at once)
export const GraphProvider = ({ children }: any) => {
  const { bounds, addBounds, remBounds } = useMinMaxAxis();
  const [dotHover, setDotHover] = useState<DotHover>();
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

  const { minX, maxX, minY, maxY } = bounds;

  const { selectedMetas } = useMetasCtx();
  const { selectedMeasurements } = useMeasurementsCtx();

  const [paths, setPaths] = useState<MeasMetaPath>({});
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
    updatePaths().then(setPaths);
  }, [selectedMetas, selectedMeasurements]);

  return (
    <GraphContext.Provider
      value={{
        minX,
        maxX,
        minY,
        maxY,
        addBounds,
        remBounds,
        dotHover,
        setDotHover,
        markers,
        useMarkers,
        lastMarkersAction,
        paths,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);
