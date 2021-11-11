import { FC, useState } from "react";

import MetaData from "./MetaData";
import Checkbox from "../Checkbox";

import { Measurements, RideMeta } from '../../assets/models'

import '../../css/ridedetails.css'
import { checkServerIdentity } from "tls";

type Props = {
    metas: RideMeta[],
	measurementClick: (measurement:Measurements, isChecked:boolean)=> void
};



const RideDetails: FC<Props> = ( { metas, measurementClick } ) => {
	

	
    return (
		<div className="meta-data">
			<Checkbox 
				className='ride-metadata-checkbox'
				content='Track Position'
				onClick={(isChecked) => measurementClick(Measurements["Track Position"], isChecked)} />
			<Checkbox 
				className='ride-metadata-checkbox'
				content='Interpolation'			
				onClick={(isChecked) => measurementClick(Measurements.Interpolation, isChecked)} />
			<Checkbox 
				className='ride-metadata-checkbox'
				content='Map Matching'
				onClick={(isChecked) => measurementClick(Measurements["Map Matching"], isChecked)} />

			{ metas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`ride-md-${i}`}></MetaData>
			) }
        </div>
  )
}

export default RideDetails;