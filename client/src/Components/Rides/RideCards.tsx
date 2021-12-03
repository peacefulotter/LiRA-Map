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

const compareMeta = ( a: RideMeta, b: RideMeta ) => {
    return b.TaskId < a.TaskId ? -1 : 1
}

const RideCards: FC<Props> = ( { metas, onClick } ) => {            
    const [ reverseSorted, setReverseSorted ] = useState<boolean>(false)
    const [ searched, setSearched ] = useState<boolean>(false)

    const [ startMonth, setStartMonth ] = useState<number>(1);
    const [ startYear, setStartYear ] = useState<number>(2020);
    const [ endMonth, setEndMonth ] = useState<number>(12);
    const [ endYear, setEndYear ] = useState<number>(2021);

    const [ showMetas, setShowMetas ] = useState<RideMeta[]>(metas);
    const [ search, setSearch ] = useState<string>("")

    const sortMetas = (md: RideMeta[]) => {
        return md.sort((a: RideMeta, b: RideMeta) => compareMeta(a, b))
    }

    const reverseSortMetas = (md: RideMeta[]) => {
        return md.sort((a: RideMeta, b: RideMeta) => compareMeta(a, b))
    }

    // avoid too much computation to make the website faster
    const sortedMetas: RideMeta[] = sortMetas(metas)
    const reverseSortedMetas: RideMeta[] = reverseSortMetas(metas)

    const getSortedInitMetas = (): RideMeta[] => {
        return reverseSorted ? reverseSortedMetas : sortedMetas 
    }

    const filterDate = (curMetas: RideMeta[]) => {
        return curMetas.filter( (meta: RideMeta) => {
            const date = new Date(meta.Created_Date)
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            return month >= startMonth && year >= startYear && month <= endMonth && year <= endYear
        })
    }

    const filterSearch = (curMetas: RideMeta[]) => {
        return searched ? curMetas.filter( (meta: RideMeta) => substring(meta, search) ) : curMetas
    }

    const filterSort = (curMetas: RideMeta[]) => {
        return reverseSorted 
            ? sortMetas(curMetas)
            : reverseSortMetas(curMetas)
    }

    useEffect( () => {
        setShowMetas(filterSort(showMetas))
    }, [reverseSorted] )

    useEffect( () => {
        setShowMetas(filterSearch(getSortedInitMetas()))
    }, [searched, search] )

    useEffect( () => {
        setShowMetas(filterDate(getSortedInitMetas()))
    }, [startMonth, endMonth, startYear, endYear])


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

    const changeStartMonth = (e: any) => setStartMonth(e.target.value);        
    const changeStartYear = (e: any) => setStartYear(e.target.value);
    const changeEndMonth = (e: any) => setEndMonth(e.target.value)
    const changeEndYear = (e: any) => setEndYear(e.target.value)

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
            <div className="ride-search-container">
                <input type='number' min="1" max="12" value={startMonth} onChange={changeStartMonth} className="ride-search-input ride-search-date-input"></input>
                <input type='number' min="2010" max="2100" value={startYear} onChange={changeStartYear} className="ride-search-input ride-search-date-input"></input>
            </div>
            <div className="ride-search-container">
                <input type='number' min="1" max="12" value={endMonth} onChange={changeEndMonth} className="ride-search-input ride-search-date-input"></input>
                <input type='number' min="2010" max="2100" value={endYear} onChange={changeEndYear} className="ride-search-input ride-search-date-input"></input>
            </div>

            <Checkbox 
                className="ride-sort-cb"
                content={`Sort ${reverseSorted ? '▼' : '▲'}`}
                onClick={setReverseSorted}/>

            { showMetas.map( (meta: RideMeta, i: number) => {
                return <Checkbox 
                        key={`ride${i}`}
                        className="ride-card-container"
                        content={`<b>${meta.TaskId}<b><br/>${meta.Created_Date}`}
                        onClick={(isChecked) => onClick(i, isChecked)} />
            } )
            }
        </div>
    )
}

export default RideCards;
