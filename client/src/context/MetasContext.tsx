import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Loading from '../Components/Loading';
import { RideMeta } from '../models/models';
import { getRides } from '../queries/rides';

interface ContextProps {
  metas: RideMeta[];
  selectedMetas: RideMeta[];
  setSelectedMetas: Dispatch<SetStateAction<RideMeta[]>>;
  focusedMeta: number;
  setFocusedMeta: Dispatch<SetStateAction<number>>;
}

const MetasContext = createContext({} as ContextProps);

export const MetasProvider = ({ children }: any) => {
  const [metas, setMetas] = useState<RideMeta[]>([]);
  const [selectedMetas, setSelectedMetas] = useState<RideMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedMeta, setFocusedMeta] = useState(0);

  // fetch the metadata of all the rides
  useEffect(
    () =>
      getRides((data) => {
        setMetas(data);
        setLoading(false);
      }),
    [],
  );

  return (
    <MetasContext.Provider
      value={{
        metas,
        selectedMetas,
        setSelectedMetas,
        focusedMeta,
        setFocusedMeta,
      }}
    >
      {children}
      <Loading loading={loading} />
    </MetasContext.Provider>
  );
};

export const useMetasCtx = () => useContext(MetasContext);
