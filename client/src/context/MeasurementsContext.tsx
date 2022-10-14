import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Loading from '../Components/Loading';

import { ActiveMeasProperties } from '../models/properties';
import { getMeasurements } from '../queries/measurements';

interface ContextProps {
  measurements: ActiveMeasProperties[];
  setMeasurements: Dispatch<SetStateAction<ActiveMeasProperties[]>>;
  selectedMeasurements: ActiveMeasProperties[];
}

const MeasurementsContext = createContext({} as ContextProps);

export const MeasurementsProvider = ({ children }: any) => {
  const [measurements, setMeasurements] = useState<ActiveMeasProperties[]>([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState<
    ActiveMeasProperties[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => setSelectedMeasurements(measurements.filter((m) => m.isActive)),
    [measurements],
  );

  useEffect(
    () =>
      getMeasurements((data) => {
        setMeasurements(data);
        setLoading(false);
      }),
    [],
  );

  return (
    <MeasurementsContext.Provider
      value={{
        measurements,
        setMeasurements,
        selectedMeasurements,
      }}
    >
      {children}
      <Loading loading={loading} />
    </MeasurementsContext.Provider>
  );
};

export const useMeasurementsCtx = () => useContext(MeasurementsContext);
