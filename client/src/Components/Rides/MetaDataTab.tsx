import { FC, useState } from "react";

import { MeasurementsModel, Ride } from '../../assets/models'
import MetaData from "./MetaData";
import Checkbox from "../Checkbox";
import '../../css/ridecard.css'

type Props = {
    ride: Ride,
    measurementTypes: MeasurementsModel
    //index: number,
    //onClick: () => void
};





const MetaDataTab: FC<Props> = ( { ride, measurementTypes } ) => {  //metadata component is put, then measurement types should be listed in a checkbox
    // FIXME: replace ride with rideMeta as props
    const [isCheckedTP, setIsCheckedTP] = useState(false);  //track position
    const handleChangeTP = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsCheckedTP(e.target.checked);
        setMeasurement();
    };

    const [isCheckedIP, setIsCheckedIP] = useState(false);   //interpolation
    const handleChangeIP = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsCheckedIP(e.target.checked);
        console.log(isCheckedIP);
        setMeasurement();
    };

    const [isCheckedMM, setIsCheckedMM] = useState(false);   //map matching
    const handleChangeMM = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsCheckedMM(e.target.checked);
        setMeasurement();
    };

    const setMeasurement = () => { 
        measurementTypes = [];
        if(isCheckedTP){
            measurementTypes.push("Track Position")
        }
        if(isCheckedIP){
            measurementTypes.push("Interpolation")
        }
        if(isCheckedMM){
            measurementTypes.push("Map Matching")
        }
        console.log({measurementTypes});      
    };

    return (
        <div className="ride-metadata-container" >
            <MetaData data = {ride.meta} key={`ride${ride}`}></MetaData>
            <div>
      

      <h3>Filters to apply: </h3>
      <div>
        <Checkbox
          handleChange={handleChangeTP}
          isChecked={isCheckedTP}
          label="Track Position"
        />
      </div>
      <div>
        <Checkbox
          handleChange={handleChangeIP}
          isChecked={isCheckedIP}
          label="Interpolation"
        />
      </div>
      <div>
        <Checkbox
          handleChange={handleChangeMM}
          isChecked={isCheckedMM}
          label="Map Matching"
        />
      </div>
    </div>
    <button onClick={setMeasurement}>
  Apply
</button>
        </div>
        
    
  )
}

export default MetaDataTab;

