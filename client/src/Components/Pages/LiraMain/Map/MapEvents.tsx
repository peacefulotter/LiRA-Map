import { FC, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents,  } from 'react-leaflet';
import {MeasurementData} from '../../../../assets/models';

interface MapEventsProps {
    setMeasurements: (measurements: MeasurementData[]) => void;
}

const MapEvents: FC<MapEventsProps> = (props) => {

    let latestZoom = 18;
    let maxrendered = 100;

    const map = useMapEvents({
        async zoomend() {

            console.log("Current zoom " + map.getZoom());
            console.log("Latest zoom " + latestZoom);
            console.log("Maximum rendered zoom " + maxrendered);

            if(map.getZoom() > latestZoom || (map.getZoom() >= maxrendered)){
                return;
            }

            maxrendered = map.getZoom();            
                        
            const bounds = map.getBounds();
            const southWest = bounds.getSouthWest();
            const northEast = bounds.getNorthEast();

            let maxlon = northEast.lng;
            let maxlat = northEast.lat;
            let minlon = southWest.lng;
            let minlat = southWest.lat;

            let path = '/measurements?T=obd.trac_cons'+
                '&maxlon='+ maxlon +
                '&maxlat='+ maxlat +
                '&minlon=' + minlon +
                '&minlat=' + minlat;

            console.log(path);
            fetch(path)
                .then(response => response.json())
                .then(data => {
                    const measurements: MeasurementData[] = data;
                    console.log(measurements);
                    props.setMeasurements(measurements);
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