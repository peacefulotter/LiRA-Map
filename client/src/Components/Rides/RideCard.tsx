import { FC, useState } from "react";

import { Ride } from '../../assets/models'

import '../../css/ridecard.css'

interface Props {
    ride: Ride,
    index: number,
    onClick: (i: number) => void
}

const Rides: FC<Props> = ( { ride, index, onClick } ) => {

    return (
        <div className="ride-card-container" onClick={() => onClick(index)}>
            <div>blob</div>
        </div>
    
  )
}

export default Rides;
