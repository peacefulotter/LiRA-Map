import { FC, useState } from "react";

import { Ride, RideMeta } from '../../assets/models'

import '../../css/ridecard.css'

type Props = {
    data: RideMeta,
    //index: number,
    //onClick: () => void
};

const MetaData: FC<Props> = ( { data } ) => {//print all necessary meta info with a map function here
    return (
        <div className="ride-metadata-container" >
            <div>{data.distance}</div>  
        </div>
    
  )
}

export default MetaData;