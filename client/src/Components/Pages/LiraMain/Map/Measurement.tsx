import { FC, useState, useEffect } from "react";
import { Circle, MapContainer, TileLayer, useMapEvent,  } from 'react-leaflet'

import '../../../../css/rides.css'
import { isPropertySignature } from "typescript";

interface MeasurementProps {
    lat: number,
    lon: number,
    message:string 
}

const Measurement: FC<MeasurementProps> = (props) => {

    const getColor = (val: number, maxval: number, minval: number): string => {

        if(val == undefined)
            return `rgb(0, 0, 0)`

        if(val > maxval)
            val = maxval;
        else if(val < minval)
            val = minval;

        val = (val - minval) * (1/(maxval-minval));

        const green: number = Math.min(val * 2, 1) * 255;
        const red: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
        return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
    }

    const getValue = () => {

        const message: string = props.message;

        if(JSON.parse(message)["obd.trac_cons.value"] != null) 
            console.log(JSON.parse(message)["obd.trac_cons.value"])

        return JSON.parse(message)["obd.trac_cons.value"];
    }


    return <Circle 
        center={[props.lat, props.lon]} 
        radius={5}
        color={getColor(getValue(), 200, 140)} />
}

export default Measurement;