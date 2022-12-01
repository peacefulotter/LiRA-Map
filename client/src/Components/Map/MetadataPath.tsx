import React, { FC, useEffect } from 'react';

import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Path as PathType, PathProps } from '../../models/path';
import Path from './Path';
import { useGraph } from '../../context/GraphContext';
import { useMetasCtx } from '../../context/MetasContext';

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

const calculateClosestIndex = (lat: number, lng: number, path: PathType) => {
  let bestDiff = Infinity;
  let closestIndex = -1;
  for (let i = 0; i < path.length; i++) {
    // This is an estimate, but it is way faster than square rooting
    const diff = Math.abs(lat - path[i].lat) + Math.abs(lng - path[i].lng);
    if (diff < bestDiff) {
      bestDiff = diff;
      closestIndex = i;
    }
  }
  return closestIndex;
};

interface IMetadataPath extends PathProps {
  taskID: number;
  measurementName: string;
}

const MetadataPath: FC<IMetadataPath> = ({
  path,
  properties,
  metadata,
  taskID,
  measurementName,
}) => {
  const { markers, useMarkers, lastMarkersAction } = useGraph();
  const { focusedMeta, setFocusedMeta } = useMetasCtx();
  const map = useMap();

  // Onclick is called 4 times
  const onClick = () => (e: any) => {
    const { lat, lng } = e.latlng;
    useMarkers({
      taskID,
      measurementName,
      source: 'MAP',
      data: {
        lat,
        lng,
        index: calculateClosestIndex(lat, lng, path),
      },
    });
  };

  useEffect(() => {
    if (
      !lastMarkersAction ||
      lastMarkersAction.source === 'MAP' ||
      !(
        lastMarkersAction.taskID === taskID &&
        lastMarkersAction.measurementName === measurementName
      )
    )
      return;

    map.setView([lastMarkersAction.data.lat, lastMarkersAction.data.lng], 15);
  }, [lastMarkersAction]);

  /* @author Benjamin Lumbye s204428 + Mads Westermann s174508 */
  useEffect(() => {
    if (focusedMeta === taskID) {
      const lat0 = path[0].lat;
      const lat1 = path[path.length - 1].lat;
      const lng0 = path[0].lng;
      const lng1 = path[path.length - 1].lng;
      const zoom = map.getBoundsZoom([
        [lat0, lng0],
        [lat1, lng1],
      ]);
      map.setView([(lat0 + lat1) / 2, (lng0 + lng1) / 2], zoom);

      setFocusedMeta(-1);
    }
  }, [focusedMeta]);

  const marker = markers[`${taskID}-${measurementName}`];
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
