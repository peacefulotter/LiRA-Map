/** @author Benjamin Lumbye s204428 */

import React, { useRef } from 'react';
import { MapContainer, TileLayer, ScaleControl } from 'react-leaflet';

import Zoom from './Zoom';

import '../../css/map.css';
import { MAP_OPTIONS } from './constants';

const MapWrapper = (props: any) => {
  const { children } = props;

  const { center, zoom, minZoom, maxZoom, scaleWidth } = MAP_OPTIONS;

  /**
   * This function fixes the map viewport being wrong in popup windows and also when resizing the map tab.
   * The bug happens because react-leaflet listens for window resize, so we fix it by listening for resizes
   * to the actual map container.
   * @author Benjamin Lumbye s204428
   */
  const resizeFix = (map: any) => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(map._container);
  };

  return (
    <MapContainer
      preferCanvas={true}
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      scrollWheelZoom={true}
      zoomControl={false}
      whenCreated={resizeFix}
    >
      <TileLayer
        maxNativeZoom={maxZoom}
        maxZoom={maxZoom}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Zoom />
      <ScaleControl
        imperial={false}
        position="bottomright"
        maxWidth={scaleWidth}
      />
      {children}
    </MapContainer>
  );
};

export default MapWrapper;
