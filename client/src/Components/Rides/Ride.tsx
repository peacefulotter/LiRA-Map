
import React, { useState, useEffect, FC } from "react";

import EventPath from "../Map/EventPath";
import usePopup from '../Popup'

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { Measurement, RideMeasurement } from "../../models/properties";
import { DataPath, Path } from "../../models/path";
import { post } from "../../queries/fetch";

import '../../css/road.css'
import ChartEventPath from "./ChartEventPath";


interface Props {
    tripId: string, 
    taskId: number, 
}


const Ride: FC<Props> = ( { tripId, taskId } ) => {

    console.log('here');
    
    const { measurements } = useMeasurementsCtx()

    // number of measurements .map
    // useMeasurementsCtx in each ChartEventPath
    
    return (
        <>
        { measurements.map( (meas: RideMeasurement, i: number) =>
            meas.isActive
                ? <ChartEventPath 
                    key={`charteventpath-${Math.random()}`}
                    tripId={tripId} 
                    taskId={taskId.toString()} 
                    measurement={meas}
                />
                : null
        ) }
        </>
    )
}

const propsAreEqual = ( prev: Readonly<React.PropsWithChildren<Props>>, next: Readonly<React.PropsWithChildren<Props>> ) => {
    console.log(prev, next);
    return prev.taskId === next.taskId && prev.tripId === next.tripId
}

export default React.memo(Ride, propsAreEqual);