
import { FC } from "react";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { RideMeasurement } from "../../models/properties";

import GraphEventPath from "./GraphEventPath";

import '../../css/road.css'
import { RideMeta } from "../../models/models";


interface Props {
    meta: RideMeta;
}

const Ride: FC<Props> = ( { meta } ) => {

    const { TripId, TaskId } = meta
    const { measurements } = useMeasurementsCtx()

    return (
        <>
        { measurements.map( (meas: RideMeasurement, i: number) =>
            meas.isActive
                ? <GraphEventPath 
                    key={`charteventpath-${i}`}
                    tripId={TripId} 
                    taskId={TaskId.toString()} 
                    measurement={meas}
                />
                : null
        ) }
        </>
    )
}

export default Ride;