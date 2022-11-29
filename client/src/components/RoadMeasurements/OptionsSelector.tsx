import { FC, useState } from "react";
import DatePicker from "react-date-picker";
import { RideMeta, TripsOptions } from '../../models/models';
import Checkbox from "../Checkbox";
import { useMetasCtx } from '../../context/MetasContext';

const defaultOptions: TripsOptions = {
    search: '',
    startDate: new Date("2020-01-01"),
    endDate: new Date(),
    reversed: false
}

interface SelectMeta extends RideMeta {
    selected: boolean;
}

export default function OptionsSelector() {

    const [options, setOptions] = useState<TripsOptions>(defaultOptions)
    // const [showMetas, setShowMetas] = useState<SelectMeta[]>([])
    const {metas, selectedMetas, setSelectedMetas,showMetas,setShowMetas} = useMetasCtx();

    const onChange2 = ({search, startDate, endDate, reversed}: TripsOptions) => {
        console.log(search)
        console.log(startDate)
        console.log(endDate)
        console.log(reversed)
        const temp: SelectMeta[] = metas
            .filter((meta: RideMeta) => {
                const inSearch = search === "" || meta.TaskId.toString().includes(search)
                const date = new Date(meta.Created_Date).getTime()
                const inDate = date >= startDate.getTime() && date <= endDate.getTime()
                return inSearch && inDate
            })
            .map((meta: RideMeta) => {
                const selected = selectedMetas.find(({TripId}) => meta.TripId === TripId) !== undefined
                return {...meta, selected}
            })
        setShowMetas(reversed ? temp.reverse() : temp)
    }
    
    const _onChange = (key: keyof TripsOptions) => {
        return function<T>(value: T) 
        {
            console.log("clicked")
            const temp = { ...options } as any
            temp[key] = value;
            setOptions(temp)
            onChange2(temp)
        }
    } 

    return (
        <div className="rides-options">
            <input 
                className="ride-search-input" 
                placeholder='Search..' 
                value={options.search} 
                onChange={e => _onChange('search')(e.target.value)} />

            <DatePicker onChange={_onChange('startDate')} value={options.startDate} className="options-date-picker" />
            <DatePicker onChange={_onChange('endDate')} value={options.endDate} className="options-date-picker" />
            <Checkbox style={{width:50}}
                className="ride-sort-cb"
                html={<div>Sort {options.reversed ? '▼' : '▲'}</div>}
                onClick={_onChange('reversed')}/>
        </div>
        
    )
}