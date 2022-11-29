import { GraphProvider } from '../../context/GraphContext';
import RidesMap from './RidesMap';
import GraphSelector from '../Graph/GraphSelector';
import Graph from '../Graph/Graph';
import Loading from '../Loading';
import React, { FC, useState } from 'react';
import { useMetasCtx } from '../../context/MetasContext';
import { useMeasurementsCtx } from '../../context/MeasurementsContext';
import { Bounds, MeasMetaPath, Path, PointData } from '../../models/path';
import { GraphData, GraphPoint } from '../../assets/graph/types';

const RidesGraph: FC = () => {
  const { selectedMetas } = useMetasCtx();
  const { selectedMeasurements } = useMeasurementsCtx();

  const [paths, setPaths] = useState<MeasMetaPath>({});
  const [loading, setLoading] = useState(false);

  const [selectedTaskID, setSelectedTaskID] = useState<number>();
  const [selectedMeasurementName, setSelectedMeasurementName] =
    useState<string>();
  const [selectedMeasurementBounds, setSelectedMeasurementBounds] =
    useState<Bounds>();

  const getGraphData = (path: Path): GraphData => {
    const x = (p: PointData) => new Date(p.metadata.timestamp).getTime();
    return path
      .map((p) => [x(p), p.value || 0] as GraphPoint)
      .sort(([x1, y1], [x2, y2]) => (x1 < x2 ? -1 : x1 === x2 ? 0 : 1));
  };

  const selectedMeasurement = selectedMeasurements.find(
    (meas) => meas.name === selectedMeasurementName,
  );

  return (
    <GraphProvider>
      <div className="map-container">
        <GraphSelector
          onMeasurementChange={setSelectedMeasurementName}
          onTripChange={setSelectedTaskID}
          taskIds={selectedMetas.map((meta) => meta.TaskId)}
          measNames={selectedMeasurements
            .filter((meas) => meas.hasValue)
            .map((meas) => meas.name)}
          taskId={selectedTaskID}
          measName={selectedMeasurementName}
        />
        {!selectedMeasurementName || !selectedTaskID ? (
          <span>
            Select at least one trip and one measurement to display data.
          </span>
        ) : !(selectedMeasurementName in paths) ||
          !(selectedTaskID in paths[selectedMeasurementName]) ? (
          <span>
            This combination trip doesn&apos;t contain data for this
            measurement.
          </span>
        ) : (
          <Graph
            labelX="Time (h:m:s)"
            labelY={selectedMeasurementName}
            absolute={true}
            time={true}
            palette={selectedMeasurement?.palette}
            bounds={selectedMeasurementBounds}
            plot={{
              pathData: paths[selectedMeasurementName][selectedTaskID].path,
              data: getGraphData(
                paths[selectedMeasurementName][selectedTaskID].path,
              ),
              bounds: paths[selectedMeasurementName][selectedTaskID].bounds,
              label: 'r-' + selectedTaskID,
            }}
            selectedTaskID={selectedTaskID}
            selectedMeasurementName={selectedMeasurementName}
          />
        )}
      </div>
      <Loading loading={loading} />
    </GraphProvider>
  );
};
