import { FC, useState } from "react";

import Checkbox from '../Checkbox';

import { Ride } from '../../assets/models'

import '../../css/ridecard.css'

interface Props {
    rides: Ride[];
    onClick: (i: number, isChecked: boolean) => void;
}

const RideCards: FC<Props> = ( { rides, onClick } ) => {

    const [ showRides, setShowRides ] = useState<Ride[]>(rides);
    const [ search, setSearch ] = useState<string>("")

    const getFilteredRides = () => {
        return rides.filter( (ride: Ride) =>
            search === '' ? true :
                ride.meta.source.toLowerCase().includes( search ) ||
                ride.meta.destination.toLowerCase().includes( search )
        )
    }

    const getSortedRides = () => {
        return [...showRides].sort((a: Ride, b: Ride) =>  
            a.meta.source.localeCompare(b.meta.source)
        )
    }

    
    const filterRides = (e: any) => {
        setSearch(e.target.value)
        setShowRides(getFilteredRides())
    }

    const clearFilter = (e: any) => {
        setSearch("")
        setShowRides(rides);
    }

    const sortRides = (isChecked: boolean) => {
        console.log(isChecked);
        
        isChecked ? 
            setShowRides(getSortedRides())
            : setShowRides(getFilteredRides())
    }

    return (
        <div className="ride-list">

            <div className="ride-search-container">
                <input 
                    className="ride-search-input" 
                    placeholder='Search..' 
                    value={search} 
                    onChange={filterRides} />
                <div 
                    className="ride-search-cross" 
                    onClick={clearFilter}>X</div>
            </div>

            <Checkbox 
                className="ride-sort-cb"
                content="Sort ▽"
                onClick={sortRides}/>

            { showRides.map( (ride: Ride, i: number) => {
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
