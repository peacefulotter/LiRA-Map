

import { FC, useState, useEffect, ReactElement } from "react";

import Checkbox from "../Checkbox";
import usePopup from "../Popup";

const PopupWrapper = (): [string, number, () => void, ReactElement] => {
    const [ name, setName ] = useState<string>('')
    const [ selected, setSelected ] = useState<number>(-1)

    const changeName = (e: any) => {        
        setName(e.target.value) 
    } 

    const select = (i: number, isChecked: boolean) => {        
        setSelected( isChecked ? i : -1 )        
    }

    const reset = () => {
        setSelected(-1)
        setName('')
    }

    return [name, selected, reset, <div>    
        <input className="sweetalert-input" placeholder="Measurement.." type='text' onChange={changeName}/>
        <div className="sweetalert-checkboxes">
            <Checkbox 
                key={`ride-md-checkbox-selected-0`}
                className='ride-metadata-checkbox'
                content={'Points'}
                forceState={selected === 0}
                onClick={(isChecked) => select(0, isChecked)} />
            <Checkbox 
                key={`ride-md-checkbox-selected-1`}
                className='ride-metadata-checkbox'
                content={'Lines'}
                forceState={selected === 1}
                onClick={(isChecked) => select(1, isChecked)} />
            <Checkbox 
                key={`ride-md-checkbox-selected-2`}
                className='ride-metadata-checkbox'
                content={'Hotlines'}
                forceState={selected === 2}
                onClick={(isChecked) => select(2, isChecked)} />
        </div>
    </div> ]
}


const AddMeasBtn: FC = () => {
    const [ checked, setChecked ] = useState<boolean>(false)
    const [selected, name, reset, popupWrapper] = PopupWrapper()

    const popup = usePopup()

    useEffect( () => {
        if ( !checked )
            return;

        reset()

        popup( {
            title: <p>Enter the name of your measurement<br/>(ex: obd.rpm, acc.xyz)</p>,
            html: popupWrapper,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add',
        } )
        .then( (result: any) => {
            setChecked(false)

            if ( !result.isConfirmed )
                return
    
            popup( {
                title: <p>{`Measurement ${name} added`}</p>,
                footer: `Will be drawn as ${selected}`,
                icon: 'success'
            } )
        })
        
    }, [checked] )
    
    
    return <Checkbox 
        key={`ride-md-checkbox-add`}
        className='ride-metadata-checkbox'
        content={'+'}
        forceState={checked}
        onClick={setChecked} />
}

export default AddMeasBtn;

