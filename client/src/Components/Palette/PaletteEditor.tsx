import { FC, MouseEvent, useState } from "react";
import { Gradient } from "react-gradient-hook";
import { CursorOptions } from "react-gradient-hook/lib/types";
import { useMap } from "react-leaflet";
import { Palette } from "react-leaflet-hotline";

import '../../css/palette.css'

interface IPaletteEditor {
    defaultPalette?: Palette;
    cursorOptions?: CursorOptions;
    onChange?: (palette: Palette) => void; 
}

const PaletteEditor: FC<IPaletteEditor> = ( { defaultPalette, cursorOptions, onChange } ) => {

    const [show, setShow] = useState<boolean>(false)

    const map = useMap()
    const { x: width } = map.getSize();

    const toggleAppear = () => setShow(prev => !prev)

    return (
        <div className={`palette-wrapper ${show ? 'palette-show' : ''}`} style={{width: `${width}px`}} >
            <div className="palette-container">
                <Gradient defaultColors={defaultPalette} cursorOptions={cursorOptions} onChange={onChange}/>
            </div>
            <div className='palette-hover' onClick={toggleAppear}>🎨</div>
        </div>
    )
}

export default PaletteEditor;
