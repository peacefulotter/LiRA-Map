import React, { FC } from 'react';

interface IGraphSelector {
  onTripChange: (value: number) => void;
  onMeasurementChange: (value: string) => void;
  taskIds: number[];
  measNames: string[];
}

const GraphSelector: FC<IGraphSelector> = ({
  onTripChange,
  onMeasurementChange,
  taskIds,
  measNames,
}) => {
  return (
    <div className="graph-selector">
      <label>
        <span>Trip: </span>
        <select
          onChange={(e) => {
            onTripChange(parseInt(e.target.value));
          }}
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
          onChange={(e) => {
            onMeasurementChange(e.target.value);
          }}
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
