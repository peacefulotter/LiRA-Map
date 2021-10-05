import { FC, useState } from "react";

import { Ride, RideMeta } from '../../assets/models'

import '../../css/ridecard.css'

type Props = {
    data: RideMeta,
    //index: number,
    //onClick: () => void
};

const MetaData: FC<Props> = ( { data } ) => {//print all necessary meta info with a map function here
    //console.log(Object.keys(data))
    return (
        <div className="ride-metadata-container" >
            {
                  //console.log(e);
                  <ul>
                  <li> Duration: {data.time} </li>
                  <li> Distance: {data.distance} </li>
                  <li> Start: {data.start_time} </li>
                  <li> End: {data.end_time} </li>
                </ul>
            }
        </div>
    )
    return (
        <div className="ride-metadata-container" >
            <div>{data.distance}</div>  
            { JSON.stringify(data)
            }
        </div>
    
  )
}

export default MetaData;