import React, { FC, useEffect, useState } from 'react';

import { useMeasurementsCtx } from '../../context/MeasurementsContext';
import { GraphProvider } from '../../context/GraphContext';
import { useMetasCtx } from '../../context/MetasContext';

import { ActiveMeasProperties } from '../../models/properties';
import { MeasMetaPath, PointData } from '../../models/path';

import { GraphData, GraphPoint } from '../../assets/graph/types';

import { getRide } from '../../queries/rides';

import Graph from '../Graph/Graph';
import RidesMap from './RidesMap';
import useToast from '../createToast';
import Loading from '../Loading';

const Rides: FC = () => {
  const { selectedMetas } = useMetasCtx();
  const { selectedMeasurements } = useMeasurementsCtx();

  const [markerPos, setMarkerPos] = useState<[number, number]>([0, 0]);
  const [markerSelected, setMarkerSelected] = useState<number | undefined>(
    undefined,
  );

  const [paths, setPaths] = useState<MeasMetaPath>({});
  const [loading, setLoading] = useState(false);

  const addMarker = (selected: number, markerPos: [number, number]) => {
    setMarkerPos(markerPos);
    setMarkerSelected(selected);
  };

  useEffect(() => {
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

    updatePaths().then(setPaths);
  }, [selectedMetas, selectedMeasurements]);

  return (
    <GraphProvider>
      <div className="map-container">
        <RidesMap
          paths={paths}
          selectedMetas={selectedMetas}
          selectedMeasurements={selectedMeasurements}
          markerSelected={markerSelected}
          markerPos={markerPos}
        />

        {selectedMeasurements.map(
          ({ hasValue, name, palette }: ActiveMeasProperties, i: number) =>
            hasValue && (
              <Graph
                key={`graph-${i}`}
                labelX="Time (h:m:s)"
                labelY={name}
                absolute={true}
                time={true}
                palette={palette}
                addMarker={addMarker}
                plots={Object.entries(paths[name] || {}).map(
                  ([TaskId, bp], j) => {
                    const { path, bounds } = bp;
                    const x = (p: PointData) =>
                      new Date(p.metadata.timestamp).getTime();
                    const data: GraphData = path
                      .map((p) => [x(p), p.value || 0] as GraphPoint)
                      .sort(([x1, y1], [x2, y2]) =>
                        x1 < x2 ? -1 : x1 === x2 ? 0 : 1,
                      );
                    return {
                      pathData: path,
                      data,
                      bounds,
                      label: 'r-' + TaskId,
                      j,
                    };
                  },
                )}
              />
            ),
        )}
      </div>
      <Loading loading={loading} />
    </GraphProvider>
  );
};

export default Rides;
