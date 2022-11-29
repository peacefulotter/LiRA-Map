import React, { FC, useEffect, useState } from 'react';
import { useGraph } from '../../context/GraphContext';

interface IGraphSelector {
  onTripChange: (value: number) => void;
  onMeasurementChange: (value: string) => void;
  taskIds: number[];
  measNames: string[];
  taskId: number | undefined;
  measName: string | undefined;
}

const GraphSelector: FC<IGraphSelector> = ({
  onTripChange,
  onMeasurementChange,
  taskIds,
  measNames,
  taskId,
  measName,
}) => {
  const [selectedTrip, setSelectedTrip] = useState<number>();
  const [selectedMeasurement, setSelectedMeasurement] = useState<string>();

  const { lastMarkersAction } = useGraph();

  useEffect(() => setSelectedTrip(taskId), [taskId]);
  useEffect(() => setSelectedMeasurement(measName), [measName]);

  useEffect(() => {
    if (!lastMarkersAction || lastMarkersAction?.source === 'GRAPH') return;
    if (lastMarkersAction.taskID !== selectedTrip)
      onTripChange(lastMarkersAction.taskID);
    if (lastMarkersAction.measurementName !== selectedMeasurement)
      onMeasurementChange(lastMarkersAction.measurementName);
  }, [lastMarkersAction]);

  return (
    <div className="graph-selector">
      <label>
        <span>Trip: </span>
        <select
          value={selectedTrip}
          onChange={(e) => onTripChange(parseInt(e.target.value))}
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
          onChange={(e) => onMeasurementChange(e.target.value)}
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
