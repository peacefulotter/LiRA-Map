import { Dispatch, FC, SetStateAction, useState } from "react";
import { FaFilter } from "react-icons/fa";

import SegmentPopup from "./SegmentPopup";
import { SegTypes } from "../../pages/CarData";
import TypesPopup from "./TypesPopup";
import { SegmentProps } from "./Segment";

import '../../css/filter.css'


export interface IFilter {
    types: SegTypes;
    setTypes: Dispatch<SetStateAction<SegTypes>>;
    segmentProps: SegmentProps | undefined;
    setSegmentProps: Dispatch<SetStateAction<SegmentProps | undefined>>;
    updateSegment: (props: SegmentProps) => void;
}

// const popup = useTypesPopup( types )

// const firePopup = () => popup.fire( (types: SegTypes) => {
//     console.log(types);
//     setTypes(types)
// } )

const FilterBtn: FC<IFilter> = ( { types, setTypes, segmentProps, setSegmentProps, updateSegment } ) => {

    const [show, setShow] = useState<boolean>(false)

    const toggleShow = () => setShow( prev => !prev )

    return (
        <>
        <FaFilter onClick={toggleShow} className="filter-button" />
        <div className="seg-popup-wrapper">
            { show ? <TypesPopup state={types} setState={setTypes}/> : null }
            { show && segmentProps ? <SegmentPopup segmentProps={segmentProps} types={types} updateSegment={updateSegment}/> : null }
        </div>
        </> 
    )
}


export default FilterBtn;