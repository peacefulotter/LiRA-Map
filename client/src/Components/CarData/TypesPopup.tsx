


import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { SegTypes } from "../../pages/CarData";

import { GetAggregationTypes, GetDataTypes } from "../../queries/DataRequests";
import Checkboxes from "./Checkboxes";


interface IPopupWrapper {
    state: SegTypes;
    setState: Dispatch<SetStateAction<SegTypes>>;
}

const TypesPopup: FC<IPopupWrapper> = ( { state, setState } ) => {
    
    const [dataTypes, setDataTypes] = useState<string[]>([]);
    const [aggrTypes, setAggrTypes] = useState<string[]>([]);

    // force child components to rerender
    const [copy, setCopy] = useState<SegTypes>({...state})
    const { dataType, aggrType } = copy;

    const updateState = (dataType: string | undefined, aggrType: string | undefined ) => {
        const newState = { dataType, aggrType }
        setState( newState )
        setCopy( newState )
    }

    const fetchAggrTypes = (dt: string) => GetAggregationTypes(dt).then( setAggrTypes )
        
    useEffect( () => {
        GetDataTypes().then( setDataTypes )
        if ( dataType !== undefined )
            fetchAggrTypes(dataType)
    }, [] );

    const dataTypeOnClick = (type: string) => () => {
        updateState( type, undefined )
        fetchAggrTypes( type )
    }

    const aggregationTypeOnClick = (type: string) => () => {
        updateState( dataType, type )
    }

    return (
        <div className="seg-popup-container">    
            <Checkboxes typeName='Data type' types={dataTypes} type={dataType} onClick={dataTypeOnClick}/>
            { dataType !== undefined
                ? <Checkboxes typeName='Aggr type' types={aggrTypes} type={aggrType} onClick={aggregationTypeOnClick}/>
                : null
            }
        </div>
    )
}

export default TypesPopup