import React, { FC, useMemo } from 'react';
import { Palette } from 'react-leaflet-hotline';

import { MeasProperties, ActiveMeasProperties } from '../../models/properties';
import { BoundedPath, MeasMetaPath } from '../../models/path';
import { RideMeta } from '../../models/models';

import PaletteEditor from '../Palette/PaletteEditor';
import { RENDERER_PALETTE } from '../Map/constants';
import MetadataPath from '../Map/MetadataPath';
import MapWrapper from '../Map/MapWrapper';
import { useGraph } from '../../context/GraphContext';
import { useMetasCtx } from '../../context/MetasContext';
import { useMeasurementsCtx } from '../../context/MeasurementsContext';

const RidesMap: FC = () => {
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

  return (
    <MapWrapper>
      {memoPaths.map(
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
      )}
    </MapWrapper>
  );
};

export default RidesMap;
