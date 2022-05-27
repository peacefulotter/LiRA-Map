
import { FC } from "react"
import Checkbox from "../Checkbox"


interface IPanel {
    measurements: string[] 
    onClick: (i: number) => (isChecked: boolean) => void;
    fetchConditions: (isChecked: boolean) => void;
}


const Panel: FC<IPanel> = ( { measurements, onClick, fetchConditions } ) => {

    return (
        <div className="panel-wrapper">
            <div className="panel-checkboxes">
                <Checkbox html={<p>GP Road</p>} onClick={fetchConditions}/>
                { measurements.map( (meas, i) => 
                    <Checkbox 
                        key={`ml-meas-cb-${i}`} 
                        className="btn panel-checkbox" 
                        html={<div>{meas}</div>} 
                        onClick={onClick(i)}/>
                ) }
            </div>
        </div>
    )
}

export default Panel