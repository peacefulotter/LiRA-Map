import { FC, useState } from "react";

import MetaData from "./MetaData";
import Checkbox from "../Checkbox";

import { MeasurementsModel, Ride } from '../../assets/models'

import '../../css/ridedetails.css'

type Props = {
    rides: Ride[],
    measurementTypes: MeasurementsModel
};


const RideDetails: FC<Props> = ( { rides, measurementTypes } ) => {
	
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

			{ rides.map( (ride: Ride, i: number) =>
				<MetaData data = {ride.meta} key={`ride-md-${i}`}></MetaData>
			) }
        </div>
  )
}

export default RideDetails;