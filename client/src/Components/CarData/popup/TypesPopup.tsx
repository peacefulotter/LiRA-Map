


import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { AggregationMethod, ComputedValueType, SegTypes } from "../../../pages/CarData";
import Checkboxes from "../Checkboxes";

import { GetAggregationTypes, GetDataTypes } from "../../../queries/DataRequests";


interface IPopupWrapper {
    types: SegTypes;
    setTypes: Dispatch<SetStateAction<SegTypes>>;
}

const TypesPopup: FC<IPopupWrapper> = ( { types, setTypes } ) => {
    
    const [dataTypes, setDataTypes] = useState<ComputedValueType[]>([]);
    const [aggrTypes, setAggrTypes] = useState<AggregationMethod[]>([]);

    const { dataType, aggrType } = types;
    var direction = -1;
    const fetchAggrTypes = (dt: ComputedValueType) => GetAggregationTypes(dt.id).then( (at) => {
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

    const dataTypeOnClick = (dataType: ComputedValueType) => () => {
        setTypes( { dataType, aggrType: undefined, direction: direction } )
    }

    const aggregationTypeOnClick = (aggrType: AggregationMethod) => () => {
        setTypes( { dataType, aggrType, direction} )
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