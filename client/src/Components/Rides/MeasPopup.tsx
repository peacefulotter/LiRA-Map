

import { useState } from "react";

import Checkbox from "../Checkbox";
import usePopup from "../Popup";
import Renderers from "../Renderers/renderers";
import { TwitterPicker, Color, ColorResult } from 'react-color';
import { Measurement, Renderer } from "../../assets/models";

interface PopupOptions {
    name?: string,
    tag?: string,
    selected?: number
    color?: string
}

interface ValidatedPopupOptions {
    name: string,
    tag: string,
    selected: number
    color: string
}

interface PopupWrapperProps {
    updateName: (val: string) => void;
    updateTag: (val: string) => void;
    updateSelected: (val: number) => void;
    updateColor: (val: string) => void;
    defaultOptions: ValidatedPopupOptions;
}

const PopupWrapper = ( { updateName, updateTag, updateSelected, updateColor, defaultOptions }: PopupWrapperProps ) => {

    const [selected, setSelected] = useState<number>(defaultOptions.selected);
    const [ color, setColor ] = useState<Color>(defaultOptions.color)

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

    const changeColor = (color: ColorResult) => {
        setColor(color.hex);
        updateColor(color.hex);
    }

    return <div className="popup-wrapper">    
        <input className="sweetalert-input" placeholder="Name.." type='text' defaultValue={defaultOptions.name} onChange={changeName}/>
        <input className="sweetalert-input" placeholder="Tag.." type='text' defaultValue={defaultOptions.tag} onChange={changeTag}/>
        <div className="sweetalert-checkboxes">
            { Renderers.map((val: Renderer, i: number) => 
                <Checkbox 
                    key={`sweetalert-checkbox-${i}`}
                    className='ride-metadata-checkbox'
                    html={<div>{val.name}</div>}
                    forceState={selected === i}
                    onClick={(isChecked) => changeSelect(i, isChecked)} />
            ) }
        </div>
        <TwitterPicker color={color} onChangeComplete={changeColor} triangle={"hide"}/>
    </div>
}

const DEFAULT_COLOR = '#bb55dd'


const useMeasPopup = () => {

    const popup = usePopup()

    return { fire: ( callback: (measurement: Measurement | undefined) => void, options?: PopupOptions ) => {

        const validatedOptions: ValidatedPopupOptions = {
            name: options?.name || '',
            tag: options?.tag || '',
            selected: options?.selected || 0,
            color: options?.color || DEFAULT_COLOR    
        }
        
        popup( {
            title: <p>Enter the name of your measurement and its tag<br/>(ex: obd.rpm, acc.xyz)</p>,
            html: <PopupWrapper 
                defaultOptions={validatedOptions}
                updateName={(val: string) => (validatedOptions.name = val)}
                updateTag={(val: string) => (validatedOptions.tag = val)}
                updateSelected={(val: number) => (validatedOptions.selected = val)} 
                updateColor={(val: string) => (validatedOptions.color = val)}/>,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add',
        } )
        .then( (result: any) => {
            if ( !result.isConfirmed )
                return callback( undefined )

            const newMeasurement: Measurement = {
                rendererIndex: validatedOptions.selected,
                query: '/trip_measurement',
                queryMeasurement: validatedOptions.tag,
                name: validatedOptions.name,
                defaultColor: validatedOptions.color,
                size: 1,
                value: 'number'
            }

            callback(newMeasurement)
    
            popup( {
                title: <p>Measurement <b>{validatedOptions.name}</b> added / modified</p>,
                footer: `Will be drawn as ${Renderers[validatedOptions.selected].name}`,
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
            } )
        })

    } }
}

export default useMeasPopup;

