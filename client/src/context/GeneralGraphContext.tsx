// @author Benjamin Lumbye s204428, Matteo Hoffmann s222952
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
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

interface ContextProps {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;

  addBounds: AddMinMaxFunc;
  remBounds: RemMinMaxFunc;

  dotHover: DotHover | undefined;
  setDotHover: Dispatch<SetStateAction<DotHover | undefined>>;
}

const GeneralGraphContext = createContext({} as ContextProps);

export const GeneralGraphProvider = ({ children }: any) => {
  const { bounds, addBounds, remBounds } = useMinMaxAxis();
  const [dotHover, setDotHover] = useState<DotHover>();

  const { minX, maxX, minY, maxY } = bounds;

  return (
    <GeneralGraphContext.Provider
      value={{
        minX,
        maxX,
        minY,
        maxY,
        addBounds,
        remBounds,
        dotHover,
        setDotHover,
      }}
    >
      {children}
    </GeneralGraphContext.Provider>
  );
};

export const useGeneralGraphContext = () => useContext(GeneralGraphContext);
