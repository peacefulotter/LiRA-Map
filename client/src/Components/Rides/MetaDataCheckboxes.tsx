import { FC, useState } from "react";

import { MeasurementsModel, Ride } from '../../assets/models'
import MetaData from "./MetaData";
import Checkbox from "../Checkbox";
import '../../css/ridemetadata.css'

type Props = {
    ride: Ride,
    measurementTypes: MeasurementsModel
};



const MetaDataCheckboxes: FC<Props> = ( { ride, measurementTypes } ) => {  //metadata component is put, then measurement types should be listed in a checkbox
	const [ checked, setChecked ] = useState<string[]>([]);
	const toggleChecked = (name: string) => {
		if ( checked.includes( name ) )
			setChecked( prev => prev.filter( n => n != name ) )
		else
			setChecked( prev => [...prev, name] )

		console.log(checked);
	}

	// TODO: change this to a for loop?
    return (
		<>
        <MetaData data = {ride.meta} key={`md${ride}`}></MetaData>
		<div className="ride-metadata-separation"></div>
		<h3>Filters to apply</h3>
		<div 
			className={`btn ride-metadata-checkbox ${checked.includes("trackpos") ? 'btn-checked' : ''}`}
			onClick={() => toggleChecked("trackpos")}>Track Position</div>
		<div 
			className={`btn ride-metadata-checkbox ${checked.includes("interpol") ? 'btn-checked' : ''}`}
			onClick={() => toggleChecked("interpol")}>Interpolation</div>
		<div 
			className={`btn ride-metadata-checkbox ${checked.includes("mapmatch") ? 'btn-checked' : ''}`}
			onClick={() => toggleChecked("mapmatch")}>Map Matching</div>
        </>
  )
}

export default MetaDataCheckboxes;

