import { FC } from "react";
import { LatLng } from "Leaflet.MultiOptionsPolyline";
import { useMapEvents,  } from 'react-leaflet';

import {MeasurementData} from '../../models/models';

interface MapEventsProps {
    setMeasurements: (measurements: MeasurementData[]) => void;
    setBoundaries: (boundaries: [LatLng, LatLng, LatLng, LatLng]) => void;
}

const MapEvents: FC<MapEventsProps> = (props) => {

    let latestZoom = 18;
    let maxrendered = 100;


    const map = useMapEvents({

      
        zoomend() {
            if(map.getZoom() > latestZoom || (map.getZoom() >= maxrendered)){
                return;
            }
            maxrendered = map.getZoom();            
                        
            const bounds = map.getBounds();
            console.log(bounds.getSouthWest())
            console.log(bounds.getSouthEast())
            console.log(bounds.getNorthEast())
            console.log(bounds.getNorthWest())
            props.setBoundaries([bounds.getSouthWest(), bounds.getSouthEast(),
              bounds.getNorthEast(), bounds.getNorthWest()])
                 
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