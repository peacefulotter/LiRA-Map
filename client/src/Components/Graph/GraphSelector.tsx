// @author Benjamin Lumbye s204428, Mads Westermann s174508

import React, { FC, useEffect, useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { useMeasurementsCtx } from '../../context/MeasurementsContext';
import { useMetasCtx } from '../../context/MetasContext';

const GraphSelector: FC = () => {
  const [selectedTrip, setSelectedTrip] = useState<number>();
  const [selectedMeasurement, setSelectedMeasurement] = useState<string>();

  const { selectedMetas } = useMetasCtx();
  const { selectedMeasurements } = useMeasurementsCtx();
  const {
    lastMarkersAction,
    setSelectedMeasurementName,
    setSelectedTaskID,
    selectedTaskID,
    selectedMeasurementName,
  } = useGraph();

  useEffect(() => setSelectedTrip(selectedTaskID), [selectedTaskID]);
  useEffect(
    () => setSelectedMeasurement(selectedMeasurementName),
    [selectedMeasurementName],
  );

  useEffect(() => {
    if (!lastMarkersAction || lastMarkersAction?.source === 'GRAPH') return;
    if (lastMarkersAction.taskID !== selectedTrip)
      setSelectedTaskID(lastMarkersAction.taskID);
    if (lastMarkersAction.measurementName !== selectedMeasurement)
      setSelectedMeasurementName(lastMarkersAction.measurementName);
  }, [lastMarkersAction]);

  const taskIds = selectedMetas.map((meta) => meta.TaskId);
  const measNames = selectedMeasurements
    .filter((meas) => meas.hasValue)
    .map((meas) => meas.name);

  return (
    <div className="graph-selector">
      <label>
        <span>Trip: </span>
        <select
          value={selectedTrip}
          onChange={(e) => setSelectedTaskID(parseInt(e.target.value))}
        >
          {taskIds.map((taskId) => (
            <option key={taskId} value={taskId}>
              {taskId}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Measurement: </span>
        <select
          value={selectedMeasurement}
          onChange={(e) => setSelectedMeasurementName(e.target.value)}
        >
          {measNames.map((measName) => (
            <option key={measName} value={measName}>
              {measName}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default GraphSelector;
