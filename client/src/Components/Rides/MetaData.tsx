import { FC, useState } from "react";

import { Ride, RideMeta } from '../../assets/models'

import '../../css/ridedetails.css'


type Props = {
    data: RideMeta,
};

//print all necessary meta info with a map function here
const MetaData: FC<Props> = ( { data } ) => {
    return (
        <>
		<div className="ride-metadata-separation"></div>
        <div className="ride-metadata-list" >
            <div className="ride-metadata-elt">Duration: {data.time} </div>
            <div className="ride-metadata-elt">Distance: {data.distance} </div>
            <div className="ride-metadata-elt">Start: {data.start_time} </div>
            <div className="ride-metadata-elt">End: {data.end_time} </div>
        </div>
        </>
    )
    
}

export default MetaData;