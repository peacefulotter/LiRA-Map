import { FC, useState } from "react";

import { Ride } from '../../assets/models'

import '../../css/ridecard.css'

interface Props {
    ride: Ride,
    index: number,
    onClick: (i: number) => void
}

const MetaDataTab: FC<Props> = ( { ride, index, onClick } ) => {
    // FIXME: replace ride with rideMeta as props
    return (
        <div className="ride-metadata-container" onClick={() => onClick(index)}>
            <div>blob</div>
        </div>
    
  )
}

export default MetaDataTab;