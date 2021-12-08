

import { FC, useState, useEffect } from "react";

import Checkbox from "../Checkbox";
import usePopup from "../Popup";
import Renderers, { Renderer } from "../../assets/renderers";
import { addMeasurement, Measurement } from "./Measurements";
import { TwitterPicker, Color, ColorResult } from 'react-color';

interface PopupWrapperProps {
    updateName: (val: string) => void;
    updateTag: (val: string) => void;
    updateSelected: (val: number) => void;
    updateColor: (val: string) => void;
}

const PopupWrapper = ( { updateName, updateTag, updateSelected, updateColor }: PopupWrapperProps ) => {

    const [ color, setColor ] = useState<Color>()
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

    const changeColor = (color: ColorResult) => {
        setColor(color.hex);
        updateColor(color.hex);
    }

    return <div className="popup-wrapper">    
        <input className="sweetalert-input" placeholder="Name.." type='text' onChange={changeName}/>
        <input className="sweetalert-input" placeholder="Tag.." type='text' onChange={changeTag}/>
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

const useMeasPopup = () => {

    const popup = usePopup()

    return { fire: ( callback: (measurement: Measurement | undefined) => void ) => {
        let name = ''
        let tag = ''
        let selected = -1;
        let color: string | undefined = undefined

        popup( {
            title: <p>Enter the name of your measurement and its tag<br/>(ex: obd.rpm, acc.xyz)</p>,
            html: <PopupWrapper 
                updateName={(val: string) => (name = val)}
                updateTag={(val: string) => (tag = val)}
                updateSelected={(val: number) => (selected = val)} 
                updateColor={(val: string) => (color = val)}/>,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add',
        } )
        .then( (result: any) => {
            if ( !result.isConfirmed )
                return callback( undefined )

            const newMeasurement: Measurement = {
                rendererIndex: selected,
                query: '/trip_measurement',
                queryMeasurement: tag,
                name: name,
                defaultColor: color || '#bb55dd',
                size: 1,
                value: 'number'
            }

            callback(newMeasurement)
    
            popup( {
                title: <p>Measurement <b>{name}</b> added</p>,
                footer: `Will be drawn as ${selected}`,
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
            } )
        })

    } }
}

export default useMeasPopup;

