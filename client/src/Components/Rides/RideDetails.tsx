import { FC } from "react";

import MetaData from "./MetaData";
import Checkbox from "../Checkbox";

import { MEASUREMENTS, RideMeta, Measurements } from '../../assets/models'

import '../../css/ridedetails.css'
import AddMeasBtn from "./AddMeasBtn";

type Props = {
    metas: RideMeta[],
	measurementClick: (measurement: keyof Measurements, isChecked: boolean) => void
};

const RideDetails: FC<Props> = ( { metas, measurementClick } ) => {

    return (
		<div className="meta-data">
			{
				Object.keys(MEASUREMENTS).map( (key: string, i: number) =>
					<Checkbox 
						key={`ride-md-checkbox-${i}`}
						className='ride-metadata-checkbox'
						content={MEASUREMENTS[key as keyof Measurements].name}
						onClick={(isChecked) => measurementClick(key as keyof Measurements, isChecked)} />
				)
			}

			<AddMeasBtn />
			
			{ metas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`ride-md-${meta.TaskId}-${i}`}></MetaData>
			) }
        </div>
  )
}

export default RideDetails;