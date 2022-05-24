
import { FC } from "react";
import Checkbox from "../Checkbox";


interface ICheckboxes {
    typeName: string;
    types: [number, string][];
    type: [number, string] | undefined;
    onClick: (type: [number, string]) => (isChecked: boolean) => void;
}

const Checkboxes: FC<ICheckboxes> = ( { typeName, types, type, onClick } ) => {    
    return (
        <div className="seg-checkboxes">
            <p className="seg-cb-name">{typeName}:</p>
            { types.map( (t: [number, string], i: number) => {
                return <Checkbox 
                    key={`popup-cb-${typeName}-${i}`}
                    forceState={t === type}
                    className='seg-checkbox'
                    html={<p>{t[1]}</p>}
                    onClick={onClick(t)} />
            } ) }
        </div>
    )
}

export default Checkboxes;