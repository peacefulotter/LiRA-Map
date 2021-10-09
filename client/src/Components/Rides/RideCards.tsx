import { FC, useState } from "react";

import Checkbox from '../Checkbox';

import { Ride } from '../../assets/models'

import '../../css/ridecard.css'

interface Props {
    rides: Ride[];
    onClick: (i: number, isChecked: boolean) => void;
}

const RideCards: FC<Props> = ( { rides, onClick } ) => {

    const sortRides = (isChecked: boolean) => {

    }

    return (
        <div className="ride-list">
            <Checkbox 
                className="ride-sort-cb"
                content="Sort ▽"
                onClick={sortRides}/>

            { rides.map( (ride: Ride, i: number) => {
                return <Checkbox 
                        key={`ride${i}`}
                        className="ride-card-container"
                        content={`${ride.meta.source}<br/>-<br/>${ride.meta.destination}`}
                        onClick={(isChecked) => onClick(i, isChecked)} />
            } )
            }
        </div>
    )
}

export default RideCards;
