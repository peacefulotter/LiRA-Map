import { FC } from "react";
import { FaFilter } from "react-icons/fa";
import useSegPopup, { SegPopupOptions } from "./SegPopup";

import '../../css/filter.css'


export interface FilterProps{
    setPropsDataType: (type: string) => void;
    setPropsAggrType: (type: string) => void;
}

const Filter: FC<FilterProps> = ( { setPropsDataType, setPropsAggrType } ) => {

    const popup = useSegPopup()

    const firePopup = () => popup.fire( (options: SegPopupOptions) => {

        const { dataType, aggrType } = options;
        
        dataType !== undefined && setPropsDataType(dataType)
        aggrType !== undefined && setPropsAggrType(aggrType)

    }, {} )

    return <FaFilter onClick={firePopup} className="filter-button" />
}


export default Filter;