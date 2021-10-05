import { FC, useState } from "react";

import { Ride } from '../../assets/models'
import MetaData from "./MetaData";
import '../../css/ridecard.css'

type Props = {
    ride: Ride,
    //index: number,
    //onClick: () => void
};

const MetaDataTab: FC<Props> = ( { ride } ) => {  //metadata component is put, then measurement types should be listed in a checkbox
    // FIXME: replace ride with rideMeta as props
    return (
        <div className="ride-metadata-container" >
            <MetaData data = {ride.meta} key={`ride${ride}`}></MetaData>
        </div>
    
  )
}

export default MetaDataTab;