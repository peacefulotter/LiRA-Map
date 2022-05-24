
import { FC } from "react";
import { AggregationMethod, ComputedValueType } from "../../pages/CarData";
import Checkbox from "../Checkbox";


interface ICheckboxes {
    typeName: string;
    types: ComputedValueType[] | AggregationMethod[];
    type: ComputedValueType | AggregationMethod | undefined;
    onClick: (type: ComputedValueType | AggregationMethod) => (isChecked: boolean) => void;
}

const Checkboxes: FC<ICheckboxes> = ( { typeName, types, type, onClick } ) => {    
    return (
        <div className="seg-checkboxes">
            <p className="seg-cb-name">{typeName}:</p>
            { types.map( (t: ComputedValueType | AggregationMethod, i: number) => {
                return <Checkbox 
                    key={`popup-cb-${typeName}-${i}`}
                    forceState={t === type}
                    className='seg-checkbox'
                    html={<p>{t.name}</p>}
                    onClick={onClick(t)} />
            } ) }
        </div>
    )
}

export default Checkboxes;