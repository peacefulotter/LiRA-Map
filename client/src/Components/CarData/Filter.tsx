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

    const firePopup = () => {
        popup.fire( (options: SegPopupOptions) => {
            const { dataType, aggrType } = options;
            console.log(dataType, aggrType);
            
            dataType !== undefined && setPropsDataType(dataType)
            aggrType !== undefined && setPropsAggrType(aggrType)
        }, {} )
    }

    return (
        <>
        <FaFilter onClick={firePopup} className="filter-button" />
        {/* // <div className="container">
        //     <div className="content">
        //         <h2>Filter</h2>
        //         <div className="subsection">
        //             <div className="title">
        //                 <p>Select the type of data you want to visualize</p>
        //             </div>
                    
        //             <div className="items">
        //                 {GetDataOptions()}
        //             </div>
        //         </div>
        //         <div className="subsection">
        //             <div className="title">
        //                 <p>Select the type of aggregation</p>
        //             </div>
                    
        //             <div className="items">
        //                 {GetAggregationOptions()}
        //             </div>
        //         </div>
        //         <button className="done-button" onClick={doneOnClick}>
        //             Done
        //         </button>
        //     </div>
        // </div> */}
        </>
    )
}


export default Filter;