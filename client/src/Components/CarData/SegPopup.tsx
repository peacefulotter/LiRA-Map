


import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { AggregationMethod, ComputedValueType, SegTypes } from "../../pages/CarData";
import usePopup from "../Popup";
import Checkbox from "../Checkbox";

import { GetAggregationTypes, GetDataTypes } from "../../queries/DataRequests";


interface ICheckboxes {
    typeName: string;
    types: ComputedValueType[] | AggregationMethod[];
    type: ComputedValueType | AggregationMethod | undefined;
    onClick: (type: ComputedValueType | AggregationMethod) => (isChecked: boolean) => void;
}

const Checkboxes: FC<ICheckboxes> = ( { typeName, types, type, onClick } ) => {
    console.log(typeName, types, type);
    
    return (
        <div className="swal-checkboxes">
            <p className="swal-cb-name">{typeName}:</p>
            { types.map( (t: ComputedValueType | AggregationMethod, i: number) => {
                return <Checkbox 
                    key={`swal-cb-${typeName}-${i}`}
                    forceState={t === type}
                    className='seg-checkbox'
                    html={<p>{t.name}</p>}
                    onClick={onClick(t)} />
            } ) }
        </div>
    )
}

interface IPopupWrapper {
    state: SegTypes;
    setState: Dispatch<SetStateAction<SegTypes>>;
}

const PopupWrapper: FC<IPopupWrapper> = ( { state, setState } ) => {

    
    const [dataTypes, setDataTypes] = useState<ComputedValueType[]>([]);
    const [aggrTypes, setAggrTypes] = useState<AggregationMethod[]>([]);

    // force child components to rerender
    const [copy, setCopy] = useState<SegTypes>({...state})
    const { dataType, aggrType } = copy;
    var direction = -1;


    const updateState = (dataType: ComputedValueType | undefined, aggrType: AggregationMethod | undefined, direction: number | undefined ) => {
        const newState = { dataType, aggrType, direction}
        setState( newState )
        setCopy( newState )
    }
        
    useEffect( () => {
        GetDataTypes().then( setDataTypes )
    }, [] );

    const dataTypeOnClick = (type: ComputedValueType) => () => {
        updateState( type, undefined, direction)
        GetAggregationTypes(type.id).then( setAggrTypes )
    }

    const aggregationTypeOnClick = (type: AggregationMethod) => () => {
        updateState( dataType, type, direction)
    }

    return (
        <div className="popup-wrapper">    
            <Checkboxes typeName='Data type' types={dataTypes} type={dataType} onClick={dataTypeOnClick}/>
            <Checkboxes typeName='Aggr type' types={aggrTypes} type={aggrType} onClick={aggregationTypeOnClick}/>
        </div>
    )
}



const useSegPopup = (types: SegTypes) => {

    const popup = usePopup(types)

    return { fire: ( callback: (opt: SegTypes) => void ) => {

        popup.fire( {
            titleText: 'Please choose the filters you wish to use',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add',
            html: <PopupWrapper state={popup.state} setState={popup.setState}/>,
        } )
        .then( (result: any) => {
            console.log(result, popup.state);
            result.isConfirmed && callback(popup.state)
        } )

    } }
}

export default useSegPopup;

