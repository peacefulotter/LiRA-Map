import { FC, useState, useEffect } from "react";
import { LatLng } from 'leaflet'

import { Measurements, MEASUREMENTS, RideData } from '../../assets/models'

import RoutingMachine from "../RoutingMachine";
import Path from "./Path";

import { post } from '../../assets/fetch'
import '../../css/road.css'


type Props = {
	tripId: string;
    measKeys: (keyof Measurements)[];
    mapZoom: number;
};

type Ride = {
    measurement: keyof Measurements
}

const Ride: FC<Props> = ( { tripId, measKeys, mapZoom } ) => {
    // TODO: define types for the state
    const [paths, setPaths] = useState<any>( (function()  {
        const keys = Object.keys(MEASUREMENTS)
        const res: {[key: string]: any} = {}
        for ( const i in keys )
        {
            res[keys[i]] = {
                loaded: false,
                path: null
            }
        }
        return res;
    } )())      

    const requestMeasurement = (measurement: keyof Measurements) => {     
        if ( paths[measurement].loaded ) return;

        post( MEASUREMENTS[measurement].query, { tripID: tripId }, (res: RideData) => {
            const data = res.map( d => { return { pos: new LatLng(d.pos.lat, d.pos.lng), value: d.value } } )
            
            const pathsCopy: any = {...paths}
            pathsCopy[measurement].loaded = true;
            pathsCopy[measurement].path = data;
            setPaths(pathsCopy)
            
            console.log("Got data for ride: ", tripId, ", length: ", res.length); 
        })
    }

    
    useEffect( () => {
        measKeys.forEach( m => requestMeasurement(m) )
    }, [measKeys] );


    return (<> 
        { 
        Object.keys(paths).map( (key: string, i: number) => 
            ( !paths[key].loaded ) 
                ? <div key={`${tripId}-path-${i}`}></div> 
                : <Path 
                path={paths[key].path} 
                zoom={mapZoom} 
                measurement={key as keyof Measurements} 
                key={`${tripId}-path-${i}`}></Path>     
        )
        }
        {/* { <RoutingMachine path={rmPath}></RoutingMachine>  } */}
        </>)
}

export default Ride;