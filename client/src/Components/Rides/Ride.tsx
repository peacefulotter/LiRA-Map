
import { FC } from "react";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { useMetasCtx } from "../../context/MetasContext";
import { RideMeasurement } from "../../models/properties";

import ChartEventPath from "./ChartEventPath";

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
                ? <ChartEventPath 
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