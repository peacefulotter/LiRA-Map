import { FC, useState } from "react";

import { MeasurementsModel, Ride } from '../../assets/models'
import MetaData from "./MetaData";
import '../../css/ridecard.css'

type Props = {
    ride: Ride,
    measurementTypes: MeasurementsModel
    //index: number,
    //onClick: () => void
};

const MetaDataTab: FC<Props> = ( { ride, measurementTypes } ) => {  //metadata component is put, then measurement types should be listed in a checkbox
    // FIXME: replace ride with rideMeta as props
    return (
        <div className="ride-metadata-container" >
            <MetaData data = {ride.meta} key={`ride${ride}`}></MetaData>
            <div>{measurementTypes}</div>
        </div>
        
    
  )
}

export default MetaDataTab;