import React, { FC, useEffect, useState } from 'react';

import { Marker, Popup } from 'react-leaflet';
import { PathProps } from '../../models/path';
import Path from './Path';
import { useGraph } from '../../context/GraphContext';
import { MarkerData } from '../../assets/graph/types';

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

const MetadataPath: FC<PathProps> = ({ path, properties, metadata }) => {
  const { markers, useMarkers } = useGraph();

  // Onclick is called 4 times
  const onClick = (i: number) => (e: any) => {
    const { lat, lng } = e.latlng;
    console.log(i);
    useMarkers({
      plot: 'TaskID-Meas',
      data: {
        lat,
        lng,
        index: i,
      },
    });
  };

  // TODO: Once graphs are individual change the key below to match this graph
  const marker = markers['TaskID-Meas'];
  const point = path[marker?.index || 0];
  const md = metadata || {};

  return (
    <>
      <Path path={path} properties={properties} onClick={onClick}></Path>

      {marker !== undefined && (
        <Marker position={[marker.lat, marker.lng]}>
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
