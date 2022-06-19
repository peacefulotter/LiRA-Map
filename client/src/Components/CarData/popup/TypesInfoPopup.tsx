
import { FC} from "react";

import { AggregationMethod, ComputedValueType } from "../../../pages/CarData";



export interface ITypesInfoPopup {
    dataType: ComputedValueType,
    aggrType: AggregationMethod
}

const TypesInfoPopup: FC<ITypesInfoPopup> = ( { dataType, aggrType } ) => {
    

    return (
        <div className="seg-popup-container">    
            <p style={{"textAlign":"justify"}}>{dataType.description}</p>
        </div>
    )
}

export default TypesInfoPopup