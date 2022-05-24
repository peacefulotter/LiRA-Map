import { FC } from "react";
import { CgArrowLongRightC } from "react-icons/cg";
import { FaFilter } from "react-icons/fa";

import Toolbar from "./Toolbar";

import TypesPopup from "../popup/TypesPopup";
import SegmentPopup from "../popup/SegmentPopup";
import DirectionPopup from "../popup/DirectionPopup";
import TypesInfoPopup from "../popup/TypesInfoPopup";

import { useSegment } from "../../../context/SegmentContext";

import '../../../css/toolbar.css'

// const popup = useTypesPopup( types )

// const firePopup = () => popup.fire( (types: SegTypes) => {
//     console.log(types);
//     setTypes(types)
// } )

const Toolbars: FC = () => {

    const { 
        pathTypes, setPathTypes, pathDirection, setPathDirection, 
        segment, setSegment, segTypes, setSegTypes, segDirection, setSegDirection
    } = useSegment()

    if(segTypes.dataType === undefined)
        setSegTypes(pathTypes)

    return (
        <div className='toolbar-wrapper'>
            <Toolbar Icon={FaFilter} isSegment={false}>
                <TypesPopup types={pathTypes} setTypes={setPathTypes} />
                {
                    pathTypes.dataType !== undefined && pathTypes.aggrType !== undefined &&
                    <TypesInfoPopup dataType={pathTypes.dataType} aggrType={pathTypes.aggrType} ></TypesInfoPopup>
                }
                <DirectionPopup curDir={pathDirection} setDir={setPathDirection} />
            </Toolbar>

            { segment !== undefined 
                ? <Toolbar Icon={CgArrowLongRightC} isSegment={true}>
                    <SegmentPopup segment={segment} types={segTypes} direction={segDirection} setSegment={setSegment} />
                    <TypesPopup types={segTypes} setTypes={setSegTypes}/>
                    {
                        segTypes.dataType !== undefined && segTypes.aggrType !== undefined &&
                        <TypesInfoPopup dataType={segTypes.dataType} aggrType={segTypes.aggrType} ></TypesInfoPopup>
                    }
                    <DirectionPopup curDir={segDirection} setDir={setSegDirection} />
                </Toolbar>
                : null
            }
        </div> 
    )
}


export default Toolbars;