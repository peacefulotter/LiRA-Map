import { FC, useEffect, useState, ReactNode } from "react";
import { List, ListRowRenderer } from "react-virtualized";

import Checkbox from '../Checkbox';

import { RideMeta } from '../../assets/models'

import '../../css/ridecard.css'

interface Props {
    metas: RideMeta[];
    onClick: (i: number, isChecked: boolean) => void;
}

const substring = (meta: RideMeta, search: string) => {
    return meta.TaskId.toString().includes( search )
}

const range = (n: number): number[] => { 
    return Array.from( {length: n}, (elt, i) => i);
}

const rangeBool = (n: number): boolean[] => { 
    return Array.from( {length: n}, () => false );
}

interface CardsProps {
    metas: RideMeta[]
    showMetas: number[]
    onClick: (i: number, isChecked: boolean) => void; 
}

const Cards: FC<CardsProps> = ( { metas, showMetas, onClick } ) => {  
    
    // necessary because react-virtualized doesn't save the state of the elements that are not rendered
    const [ checked, setChecked ] = useState<boolean[]>(rangeBool(metas.length))

    const renderRow: ListRowRenderer = ( { index, key, style } ): ReactNode => {
        const n = showMetas[index];
        const meta = metas[n];
        return <div key={key} style={style}>
            <Checkbox 
                forceState={checked[n]}
                className="ride-card-container"
                content={`<b>${meta.TaskId}</b><br></br>${new Date(meta.Created_Date).toLocaleDateString()}`}
                onClick={(isChecked) => {
                    const updated = [...checked]
                    updated[n] = isChecked;
                    setChecked(updated)
                    onClick(n, isChecked) 
                }} />
        </div>
    }

    return <List
        width={170}
        height={2500}
        rowHeight={61}
        rowRenderer={renderRow}
        rowCount={showMetas.length} /> 
}

interface InputProps {
    min: number, max: number, current: number;
}

const useInput = ( { min, max, current }: InputProps ) => {
    const [value, setValue] = useState<number>(current);
    const input = <input 
        type='number' min={min} max={max} value={value} 
        onChange={(e: any) => setValue(e.target.value as number)} 
        className="ride-search-input ride-search-date-input" />;
    return [value, input];
  }

const RideCards: FC<Props> = ( { metas, onClick } ) => {                
    const [ searched, setSearched ] = useState<boolean>(false)
    const [ sorted, setSorted ] = useState<boolean>(true)

    const [ startMonth, startMonthInput ] = useInput( { min: 1, max: 12, current: 1 } )
    const [ startYear, startYearInput ] = useInput( { min: 2019, max: 2050, current: 2019 } )
    const [ endMonth, endMonthInput ] = useInput( { min: 1, max: 12, current: 12 } )
    const [ endYear, endYearInput ] = useInput( { min: 2019, max: 2050, current: 2021 } )

    const [ showMetas, setShowMetas ] = useState<number[]>([]);
    const [ search, setSearch ] = useState<string>("")

    const getOrderedMD = () => {
        return sorted ? range(metas.length) : range(metas.length).reverse()
    }

    const changeOrder = (isChecked: boolean) => {
        setSorted(!isChecked)
        setShowMetas([...showMetas].reverse())
    }
    
    
    useEffect( () => {
        setShowMetas(range(metas.length))
    }, [metas])

    useEffect( () => {  
        const filterSearch = (): number[] => {
            return searched 
                ? getOrderedMD().filter( (n: number) => substring(metas[n], search) ) 
                : getOrderedMD()
        }

        setShowMetas(filterSearch())
    }, [searched, search] )

    useEffect( () => {
        const filterDate = () => {
            const before = new Date(startYear as number, startMonth as number - 1).getTime()
            const after = new Date(endYear as number, endMonth as number - 1).getTime()
    
            return getOrderedMD().filter( (n: number) => {
                const date = new Date(metas[n].Created_Date).getTime()
                return date >= before && date <= after 
            })
        }

        setShowMetas(filterDate())
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
                { startMonthInput }
                { startYearInput }
            </div>
            <div className="ride-search-container">
                { endMonthInput }
                { endYearInput }
            </div>

            <Checkbox 
                className="ride-sort-cb"
                content={`Sort ${sorted ? '▲' : '▼'}`}
                onClick={changeOrder}/>

            <Cards metas={metas} showMetas={showMetas} onClick={onClick} />            
        </div>
    )
}

export default RideCards;
