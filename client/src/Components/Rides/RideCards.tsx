import { FC, useEffect, useState } from "react";

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

const substring = (meta: RideMeta, search: string) => {
    return meta.TaskId.toString().includes( search )
}

const RideCards: FC<Props> = ( { metas, onClick } ) => {            
    const [ sorted, setSorted ] = useState<boolean>(false)
    const [ searched, setSearched ] = useState<boolean>(false)

    const [ showRides, setShowRides ] = useState<number[]>(range(metas.length));
    const [ search, setSearch ] = useState<string>("")

    const updateRides = () => {
        let rides = range(metas.length);

        if ( searched )
            rides = rides
                .map( (n: number, i: number ) => substring(metas[n], search) ? i : -1 )
                .filter( (i: number) => i > 0 )

        if ( sorted )
            rides = rides.sort((a: number, b: number) =>
                metas[a].TaskId < metas[b].TaskId ? -1 : 1
            )

        setShowRides(rides)
    }

    useEffect(updateRides, [searched, search, sorted, metas])


    const clearFilter = () => {
        setSearch('')
        setSearched(false)
    }
    
    const onFilterInput = (e: any) => {
        console.log('filter rides', e.target.value);
        
        if ( e.target.value === '')
            return clearFilter()

        setSearch(e.target.value)
        setSearched(true)
    }

    return (
        <div className="ride-list">

            <div className="ride-search-container">
                <input 
                    className="ride-search-input" 
                    placeholder='Search..' 
                    value={search} 
                    onChange={onFilterInput} />
                <div 
                    className="ride-search-cross" 
                    onClick={clearFilter}>X</div>
            </div>

            <Checkbox 
                className="ride-sort-cb"
                content="Sort ▽"
                onClick={setSorted}/>

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
