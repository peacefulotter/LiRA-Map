import { FC } from "react";
import { useMapEvents,  } from 'react-leaflet';
import {MeasurementData, SegmentProps} from '../../models/models';
import {GetSegmentsAndAverageValuesInAPolygon} from '../../queries/DataRequests';

interface MapEventsProps {
    setMeasurements: (measurements: MeasurementData[]) => void;
    setSegments: (segments: SegmentProps[]) => void;
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
            await GetSegmentsAndAverageValuesInAPolygon([bounds.getSouthWest(), bounds.getSouthEast(),
                 bounds.getNorthEast(), bounds.getNorthWest()], 'obd.trac_cons')
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