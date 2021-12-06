

import { FC, useState, useEffect } from "react";

import Checkbox from "../Checkbox";
import usePopup from "../Popup";
import Renderers, { Renderer } from "../../assets/renderers";
import { Measurements, Measurement } from "../../assets/measurements";

interface PopupWrapperProps {
    updateName: (val: string) => void;
    updateTag: (val: string) => void;
    updateSelected: (val: number) => void;
}

const PopupWrapper = ( { updateName, updateTag, updateSelected }: PopupWrapperProps ) => {

    const [selected, setSelected] = useState<number>(-1);

    const changeName = (e: any) => {                
        updateName(e.target.value) 
    } 

    const changeTag = (e: any) => {                
        updateTag(e.target.value) 
    } 

    const changeSelect = (i: number, isChecked: boolean) => { 
        const update = isChecked ? i : -1  
        setSelected( update );
        updateSelected( update )  
    }

    return <div>    
        <input className="sweetalert-input" placeholder="Name.." type='text' onChange={changeName}/>
        <input className="sweetalert-input" placeholder="Tag.." type='text' onChange={changeTag}/>
        <div className="sweetalert-checkboxes">
            { Renderers.map((val: Renderer, i: number) => 
                <Checkbox 
                    key={`sweetalert-checkbox-${i}`}
                    className='ride-metadata-checkbox'
                    content={val.name}
                    forceState={selected === i}
                    onClick={(isChecked) => changeSelect(i, isChecked)} />
            ) }
        </div>
    </div>
}


const AddMeasBtn: FC = () => {

    const [ checked, setChecked ] = useState<boolean>(false)

    const popup = usePopup()

    useEffect( () => {
        if ( !checked )
            return;

        let name = ''
        let tag = ''
        let selected = -1;

        popup( {
            title: <p>Enter the name of your measurement and its tag<br/>(ex: obd.rpm, acc.xyz)</p>,
            html: <PopupWrapper 
                updateName={(val: string) => (name = val)}
                updateTag={(val: string) => (tag = val)}
                updateSelected={(val: number) => (selected = val)} />,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add',
        } )
        .then( (result: any) => {
            setChecked(false)

            if ( !result.isConfirmed )
                return

            const newMeasurement: Measurement = {
                rendererIndex: selected,
                query: '/trip_measurement',
                queryMeasurement: tag,
                name: name,
                defaultColor: '#aaaadd',
                size: 1,
                value: 'number'
            }
            Measurements.push(newMeasurement)
    
            popup( {
                title: <p>Measurement <b>{name}</b> added</p>,
                footer: `Will be drawn as ${selected}`,
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
            } )
        })
        
    }, [checked] )
    
    
    return <Checkbox 
        className='ride-metadata-checkbox md-checkbox-add'
        content={'+'}
        forceState={checked}
        onClick={setChecked} />
}

export default AddMeasBtn;

