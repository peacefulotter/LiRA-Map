

import { FC, useState } from "react";

import Checkbox from "../Checkbox";
import usePopup from "../Popup";
import { TwitterPicker, Color, ColorResult } from 'react-color';
import renderers from "../../assets/renderers";
import { RendererName } from "../../models/renderers";
import { RideMeasurement } from "../../models/properties";

interface PopupOptions {
    name: string,
    tag: string,
    renderer: RendererName,
    color: string
}

interface IPopupWrapper {
    updateName: (val: string) => void;
    updateTag: (val: string) => void;
    updateSelected: (val: RendererName) => void;
    updateColor: (val: string) => void;
    defaultOptions: PopupOptions;
}

const PopupWrapper: FC<IPopupWrapper> = ( { updateName, updateTag, updateSelected, updateColor, defaultOptions } ) => {

    const [renderer, setRenderer] = useState<RendererName>(defaultOptions.renderer);
    const [color, setColor] = useState<Color>(defaultOptions.color)

    const changeName = ( { target }: any ) => updateName(target.value) 

    const changeTag = ( { target }: any ) => updateTag(target.value) 

    const changeSelect = (rendererName: RendererName) => () => { 
        setRenderer( rendererName );
        updateSelected( rendererName )  
    }

    const changeColor = (color: ColorResult) => {
        setColor(color.hex);
        updateColor(color.hex);
    }

    return (
        <div className="popup-wrapper">    
            <input className="sweetalert-input" placeholder="Name.." type='text' defaultValue={defaultOptions.name} onChange={changeName}/>
            <input className="sweetalert-input" placeholder="Tag.." type='text' defaultValue={defaultOptions.tag} onChange={changeTag}/>
            <div className="sweetalert-checkboxes">
                { Object.keys(renderers).map( (rendererName: string, i: number) => 
                    <Checkbox 
                        key={`sweetalert-checkbox-${i}`}
                        className='ride-metadata-checkbox'
                        html={<div style={{textTransform: "capitalize"}}>{rendererName}</div>}
                        forceState={renderer === rendererName}
                        onClick={changeSelect(rendererName as RendererName)} />
                ) }
            </div>
            <TwitterPicker color={color} onChangeComplete={changeColor} triangle={"hide"}/>
        </div>
    )
}

const useMeasPopup = ( value: RideMeasurement ) => {

    const popup = usePopup<RideMeasurement>(value)

    return { fire: ( callback: (measurement: RideMeasurement) => void, options: PopupOptions) => {

        popup.fire( {
            title: <p>Enter the name of your measurement and its tag<br/>(ex: obd.rpm, acc.xyz)</p>,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add',
            html: <PopupWrapper 
                defaultOptions={options}
                updateName={(val: string) => (options.name = val)}
                updateTag={(val: string) => (options.tag = val)}
                updateSelected={(val: RendererName) => (options.renderer = val)} 
                updateColor={(val: string) => (options.color = val)}/>,
        } )
        .then( (result: any) => {
            if ( !result.isConfirmed )
                return

            const newMeasurement: RideMeasurement = {
                rendererName: options.renderer,
                dbName: options.tag,
                name: options.name,
                color: options.color,
                width: 1,
                hasValue: true,
                isActive: false
            }

            callback(newMeasurement)
    
            popup.fire( {
                title: <p>Measurement <b>{newMeasurement.name}</b> added / modified</p>,
                footer: `Will be drawn as ${newMeasurement.rendererName}`,
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
            } )
        })

    } }
}

export default useMeasPopup;

