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
  MarkerData,
  MarkersRecord,
  RemMinMaxFunc,
} from '../assets/graph/types';

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
  useMarkers: Dispatch<{ plot: string; data: MarkerData }>;
}

const GraphContext = createContext({} as ContextProps);

// TODO: remove bounds / refactor?  -> is it needed really?
// TODO: generalize DotHover into an "Event State" (to support for more events at once)
export const GraphProvider = ({ children }: any) => {
  const { bounds, addBounds, remBounds } = useMinMaxAxis();
  const [dotHover, setDotHover] = useState<DotHover>();
  const [markers, useMarkers] = useReducer(
    (state: MarkersRecord, action: { plot: string; data: MarkerData }) => {
      // If the data already is as requested then don't update
      const existingMarker = state[action.plot];
      if (
        existingMarker &&
        existingMarker.lat === action.data.lat &&
        existingMarker.lng === action.data.lng &&
        existingMarker.index === action.data.index
      )
        return state;
      const newState = { ...state };
      newState[action.plot] = action.data;
      return newState;
    },
    {},
  );

  const { minX, maxX, minY, maxY } = bounds;

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
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);
