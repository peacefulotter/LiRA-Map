import { FC, useState } from "react";

import MetaData from "./MetaData";
import Checkbox from "../Checkbox";

import { Measurements, RideMeta } from '../../assets/models'

import '../../css/ridedetails.css'

type Props = {
    metas: RideMeta[],
    measurementTypes: Measurements
};


const RideDetails: FC<Props> = ( { metas, measurementTypes } ) => {
	
	const doSomething = (isChecked: boolean) => {
		console.log(isChecked);
	}
	
    return (
		<div className="meta-data">
			<h3>Filters to apply</h3>
			<Checkbox 
				className='ride-metadata-checkbox'
				content='Track Position'
				onClick={doSomething} />
			<Checkbox 
				className='ride-metadata-checkbox'
				content='Interpolation'			
				onClick={doSomething}/>
			<Checkbox 
				className='ride-metadata-checkbox'
				content='Map Matching'
				onClick={doSomething}/>

			{ metas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`ride-md-${i}`}></MetaData>
			) }
        </div>
  )
}

export default RideDetails;