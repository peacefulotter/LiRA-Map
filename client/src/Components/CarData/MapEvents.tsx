import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents,  } from 'react-leaflet';
import {MeasurementData, PathProps} from '../../assets/models';
import {GetSegmentsInAPolygon} from '../../assets/DataRequests';

interface MapEventsProps {
    setMeasurements: (measurements: MeasurementData[]) => void;
    setSegments: (segments: PathProps[]) => void;
}

const MapEvents: FC<MapEventsProps> = (props) => {

    let latestZoom = 18;
    let maxrendered = 100;

    const map = useMapEvents({
        async zoomend() {

            if(map.getZoom() > latestZoom || (map.getZoom() >= maxrendered)){
                return;
            }
            maxrendered = map.getZoom();            
                        
            const bounds = map.getBounds();
            await GetSegmentsInAPolygon([bounds.getSouthWest(), bounds.getSouthEast(),
                 bounds.getNorthEast(), bounds.getNorthWest()])
                 .then(res => {
                   props.setSegments(res);
                 });
                 
        },
        zoomstart() {
          latestZoom = map.getZoom();

          if(map.getZoom() < maxrendered)
            maxrendered = latestZoom;
        },
      })

    return null
  }


  export default MapEvents;