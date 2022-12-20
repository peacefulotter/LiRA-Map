/** @author Benjamin Lumbye s204428, Mads Westermann s174508 */

import React, { FC, useMemo } from 'react';

import { MeasProperties, ActiveMeasProperties } from '../../models/properties';
import { BoundedPath, MeasMetaPath } from '../../models/path';
import { RideMeta } from '../../models/models';

import { useMetasCtx } from '../../context/MetasContext';

import MetadataPath from '../Map/MetadataPath';
import MetadataHelper from '../Map/MetadataHelper';
import MapWrapper from '../Map/MapWrapper';
import { useGraph } from '../../context/GraphContext';
import { useMeasurementsCtx } from '../../context/MeasurementsContext';

import '../../css/rides_map.css';

interface IRidesMap {
  paths: MeasMetaPath;
  selectedMetas: RideMeta[];
  selectedMeasurements: ActiveMeasProperties[];
}

const RidesMap: FC = () => {
  const { setFocusedMeta } = useMetasCtx();
  const { selectedMetas } = useMetasCtx();
  const { selectedMeasurements } = useMeasurementsCtx();
  const { paths } = useGraph();

  const memoPaths = useMemo(() => {
    const temp: { meas: MeasProperties; meta: RideMeta; bp: BoundedPath }[] =
      [];
    selectedMeasurements.forEach((meas) => {
      const { name } = meas;
      return selectedMetas.forEach((meta) => {
        const { TaskId } = meta;
        if (Object.hasOwn(paths, name) && Object.hasOwn(paths[name], TaskId))
          temp.push({ meas, meta, bp: paths[name][TaskId] });
      });
    });
    return temp;
  }, [paths]);

  const metadataPaths = memoPaths.map(
    ({ bp, meas, meta }) =>
      bp && (
        <MetadataPath
          key={`ride-mp-${meta.TaskId}-${meas.name}`}
          path={bp.path}
          properties={meas}
          metadata={meta}
          taskID={meta.TaskId}
          measurementName={meas.name}
        />
      ),
  );

  const lat0list = memoPaths.map(({ bp }) => bp.path[0].lat);
  const lat1list = memoPaths.map(({ bp }) => bp.path[bp.path.length - 1].lat);
  const lng0list = memoPaths.map(({ bp }) => bp.path[0].lng);
  const lng1list = memoPaths.map(({ bp }) => bp.path[bp.path.length - 1].lng);

  const metadataHelper = (
    <MetadataHelper
      key={'metadatahelper'}
      boundLats={[...lat0list, ...lat1list]}
      boundLngs={[...lng0list, ...lng1list]}
    />
  );

  return (
    <div className="road-measurements-map">
      {selectedMetas.length > 0 && selectedMeasurements.length > 0 ? (
        <button
          className="focus-trips-button"
          onClick={() => {
            setFocusedMeta(0);
          }}
          title="Show all selected trips at the same time"
        >
          Focus Selected Trips
        </button>
      ) : null}
      <MapWrapper>{[...metadataPaths, metadataHelper]}</MapWrapper>
    </div>
  );
};

export default RidesMap;
