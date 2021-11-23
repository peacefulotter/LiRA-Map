import { FC, useState } from "react";

import MetaData from "./MetaData";
import Checkbox from "../Checkbox";

import { MeasurementProperties, MeasurementProperty, Measurements, RideMeta } from '../../assets/models'

import '../../css/ridedetails.css'
import { checkServerIdentity } from "tls";

type Props = {
    metas: RideMeta[],
	measurementClick: (measurement: Measurements, isChecked: boolean) => void
};


const RideDetails: FC<Props> = ( { metas, measurementClick } ) => {
    return (
		<div className="meta-data">
			{
				MeasurementProperties.map( (property: MeasurementProperty, i: number) =>
					<Checkbox 
						key={`ride-md-checkbox-${i}`}
						className='ride-metadata-checkbox'
						content={property.name}
						onClick={(isChecked) => measurementClick(i, isChecked)} />
				)
			}

			{ metas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`ride-md-${i}`}></MetaData>
			) }
        </div>
  )
}

export default RideDetails;