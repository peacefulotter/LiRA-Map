import { FC, useState } from "react";

import Checkbox from '../Checkbox';

import { RideMeta } from '../../assets/models'

import '../../css/ridecard.css'

const range = (n: number) => { 
    return Array.from( {length: n}, (elt, i) => i);
}

interface Props {
    metas: RideMeta[];
    onClick: (i: number, isChecked: boolean) => void;
}

const RideCards: FC<Props> = ( { metas, onClick } ) => {

    const [ showRides, setShowRides ] = useState<number[]>(range(metas.length));
    const [ search, setSearch ] = useState<string>("")

    const getFilteredRides = () => {
        return metas
            .map( (meta: RideMeta, i: number) =>
                search === '' && meta.TaskId.toString().includes( search ) 
                ? -1 : i
                // meta.source.toLowerCase().includes( search ) ||
                // meta.destination.toLowerCase().includes( search )
            )
            .filter( (i: number) => i > 0 )
    }

    const getSortedRides = () => {
        return [...showRides].sort((a: number, b: number) =>  
            metas[a].TaskId.toString().localeCompare(metas[b].TaskId.toString()) 
        )
    }

    
    const filterRides = (e: any) => {
        setSearch(e.target.value)
        setShowRides(getFilteredRides())
    }

    const clearFilter = (e: any) => {
        setSearch("")
        setShowRides(range(metas.length));
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

            { showRides.map( (num: number, i: number) => {
                return <Checkbox 
                        key={`ride${i}`}
                        className="ride-card-container"
                        content={`${metas[num].TripId}<br/>-<br/>${metas[num].TaskId}`}
                        onClick={(isChecked) => onClick(i, isChecked)} />
            } )
            }
        </div>
    )
}

export default RideCards;
