import { FC } from "react";
import { CgArrowLongRightC } from "react-icons/cg";
import { FaFilter } from "react-icons/fa";

import Toolbar from "./Toolbar";

import TypesPopup from "../popup/TypesPopup";
import SegmentPopup from "../popup/SegmentPopup";
import DirectionPopup from "../popup/DirectionPopup";

import { useSegment } from "../../../context/SegmentContext";

import '../../../css/toolbar.css'

// const popup = useTypesPopup( types )

// const firePopup = () => popup.fire( (types: SegTypes) => {
//     console.log(typ s);
//     setTypes(types)
// } )

const Toolbars: FC = () => {

    const { 
        pathTypes, setPathTypes, pathDirection, setPathDirection, 
        segment, segTypes, setSegTypes, segDirection, setSegDirection
    } = useSegment()

    return (
        <div className='toolbar-wrapper'>
            <Toolbar Icon={FaFilter} isSegment={false}>
                <TypesPopup types={pathTypes} setTypes={setPathTypes} />
                <DirectionPopup curDir={pathDirection} setDir={setPathDirection} />
            </Toolbar>

            { segment !== undefined 
                ? <Toolbar Icon={CgArrowLongRightC} isSegment={true}>
                    <SegmentPopup segment={segment} types={segTypes} />
                    <TypesPopup types={segTypes} setTypes={setSegTypes}/>
                    <DirectionPopup curDir={segDirection} setDir={setSegDirection} />
                </Toolbar>
                : null
            }
        </div> 
    )
}


export default Toolbars;