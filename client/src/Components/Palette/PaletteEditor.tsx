import { FC, useState } from "react";
import { Gradient } from "react-gradient-hook";
import { CursorOptions, TRGB } from "react-gradient-hook/lib/types";

import { Palette } from "../../models/graph";

import '../../css/palette.css'


interface IPaletteEditor {
    defaultPalette?: Palette;
    cursorOptions?: CursorOptions;
    onChange?: (palette: TRGB[]) => void; 
}

const PaletteEditor: FC<IPaletteEditor> = ( { defaultPalette, cursorOptions, onChange } ) => {

    const [show, setShow] = useState<boolean>(false)

    const toggleAppear = () => setShow(prev => !prev)

    return (
        <div className={`palette-wrapper ${show ? 'palette-show' : ''}`}>
            <div className="palette-container">
                <Gradient defaultColors={defaultPalette} cursorOptions={cursorOptions}onChange={onChange}/>
            </div>
            <div className='palette-hover' onClick={toggleAppear}>🎨</div>
        </div>
    )
}

export default PaletteEditor;
