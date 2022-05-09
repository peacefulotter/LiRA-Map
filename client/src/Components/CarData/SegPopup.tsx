


import { FC, useEffect, useState } from "react";

import usePopup from "../Popup";
import Checkbox from "../Checkbox";

import { GetAggregationTypes, GetDataTypes } from "../../queries/DataRequests";


interface ICheckboxes {
    types: string[];
    type: string | undefined;
    onClick: (_: boolean, e: any) => void;
}

const Checkboxes: FC<ICheckboxes> = ( { types, type, onClick } ) => {
    return (
        <div className="sweetalert-checkboxes">
            { types.map( (t: string, i: number) => {
                
                const color = t === type ? '#2146FF' : '#9CADFF'
                
                return <Checkbox 
                    key={`sweetalert-data-checkbox-${i}`}
                    style={{background: color}}
                    className='item'
                    html={<p>{t}</p>}
                    onClick={onClick} />
            } ) }
        </div>
    )
}


export interface SegPopupOptions {
    dataType?: string;
    aggrType?: string;
}

interface IPopupWrapper {
    updateDataType: (dt: string) => void;
    updateAggrType: (at: string) => void;
    options: SegPopupOptions;
}

const PopupWrapper: FC<IPopupWrapper> = ( { updateDataType, updateAggrType, options } ) => {

    const [dataTypes, setDataTypes] = useState<string[]>([]);
    const [aggrTypes, setAggrTypes] = useState<string[]>([]);

    const { dataType, aggrType } = options;

    useEffect( () => {
        console.log("fetching data");
        GetDataTypes().then( setDataTypes )
    }, [] );

    const fetchAggregationTypes = (dataType: string) => {
        console.log("fetching " + dataType)
        GetAggregationTypes(dataType).then( (newAggrTypes) => {
            console.log(newAggrTypes);
            setAggrTypes(newAggrTypes)
        } )
    }

    const dataTypeOnClick = ( _: boolean, { target }: any ) => {
        const { textContent } = target;
        console.log('dataTypeOnClick', textContent);
        updateDataType(textContent);
        fetchAggregationTypes(textContent);
    }

    const aggregationTypeOnClick = ( _: boolean, { target }: any ) => {
        const { textContent } = target;
        updateAggrType( textContent );
    }

    return (
        <div className="popup-wrapper">    
            <Checkboxes types={dataTypes} type={dataType} onClick={dataTypeOnClick}/>
            <Checkboxes types={aggrTypes} type={aggrType} onClick={aggregationTypeOnClick}/>
        </div>
    )
}

const useSegPopup = () => {

    const popup = usePopup()

    return { fire: ( callback: (opt: SegPopupOptions) => void, options: SegPopupOptions) => {

        popup( {
            title: <p>Filter<br/></p>,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add',
            html: 
                <PopupWrapper 
                    options={options}
                    updateDataType={ (dt: string) => (options.dataType = dt)}
                    updateAggrType={ (at: string) => (options.aggrType = at)}
                />,
        } )
        .then( (result: any) => {
            if ( !result.isConfirmed )
                return

            console.log(result, options);
            
            callback(options)
    
            // popup( {
            //     title: <p>Filter</p>,
            //     footer: `Will be drawn as ${a.name}`,
            //     icon: 'success',
            //     timer: 1500,
            //     timerProgressBar: true,
            // } )
        })

    } }
}

export default useSegPopup;

