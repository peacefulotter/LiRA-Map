


import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { SegTypes } from "../../pages/CarData";

import { GetAggregationTypes, GetDataTypes } from "../../queries/DataRequests";
import Checkboxes from "./Checkboxes";


interface IPopupWrapper {
    types: SegTypes;
    setTypes: Dispatch<SetStateAction<SegTypes>>;
}

const TypesPopup: FC<IPopupWrapper> = ( { types, setTypes } ) => {
    
    const [dataTypes, setDataTypes] = useState<string[]>([]);
    const [aggrTypes, setAggrTypes] = useState<string[]>([]);

    const { dataType, aggrType } = types;

    const fetchAggrTypes = (dt: string) => GetAggregationTypes(dt).then( (at) => {
        console.log(dt, at);
        setAggrTypes(at); 
    })
        
    useEffect( () => {
        GetDataTypes().then( setDataTypes )
    }, [] );

    useEffect( () => {
        if ( dataType !== undefined )
            fetchAggrTypes(dataType)
    }, [dataType])

    const dataTypeOnClick = (dataType: string) => () => {
        setTypes( { dataType, aggrType: undefined } )
    }

    const aggregationTypeOnClick = (aggrType: string) => () => {
        setTypes( { dataType, aggrType } )
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