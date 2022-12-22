import React from 'react';
import { ZoomControl } from 'react-leaflet';
import useZoom from './Hooks/useZoom';

const Zoom = () => {
  const zoom = useZoom();

  return (
    <>
      <div className="map-zoom">{zoom ? Math.round(zoom) : zoom}</div>
      <ZoomControl position="topright" />
    </>
  );
};

export default Zoom;
