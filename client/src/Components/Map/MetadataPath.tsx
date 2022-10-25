import React, { FC, useEffect, useState } from 'react';

import { Marker, Popup } from 'react-leaflet';
import { PathProps } from '../../models/path';
import Path from './Path';

const parseMD = (mds: any) => {
  if (typeof mds === 'object' && Array.isArray(mds)) {
    return (
      <div key={`md-${Math.random()}`}>
        {mds.map((md) => parseMD(md)).join(', ')}
      </div>
    );
  } else if (typeof mds === 'object') {
    return Object.keys(mds).map((k) => (
      <div key={`md-${Math.random()}`}>
        {' '}
        {' > '} {k}: {parseMD(mds[k])}
      </div>
    ));
  }

  return mds;
};

const getPopupLine = (key: string, value: any) => {
  if (value === undefined || value === null) return null;
  else if (typeof value === 'object')
    return (
      <div key={`popupline-${Math.random()}`}>
        {key}:{parseMD(value)}
      </div>
    );

  return (
    <div key={`popupline-${Math.random()}`}>
      {key}: {value}
    </div>
  );
};

const MetadataPath: FC<PathProps> = ({
  path,
  properties,
  metadata,
  selected,
  markerPos,
}) => {
  const [_markerPos, setMarkerPos] = useState<[number, number]>([0, 0]);
  const [_selected, setSelected] = useState<number | undefined>(undefined);

  const onClick = (i: number) => (e: any) => {
    const { lat, lng } = e.latlng;
    setMarkerPos([lat, lng]);
    setSelected(i);
  };

  useEffect(() => {
    if (markerPos === undefined || selected === undefined) {
      setSelected(undefined);
      return;
    }

    setMarkerPos(markerPos);
    setSelected(selected);
  }, [selected, markerPos]);

  const point = path[_selected || 0];
  const md = metadata || {};

  return (
    <>
      <Path path={path} properties={properties} onClick={onClick}></Path>

      {_selected !== undefined && (
        <Marker position={_markerPos}>
          <Popup>
            {getPopupLine('Properties', properties)}
            {getPopupLine('Value', point.value)}
            {Object.keys(point.metadata || {}).map((key) =>
              getPopupLine(key, point.metadata[key]),
            )}
            {Object.keys(md).map((key) => getPopupLine(key, md[key]))}
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default MetadataPath;
