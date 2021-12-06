import { FC } from "react";

import MetaData from "./MetaData";
import Checkbox from "../Checkbox";

import { RideMeta } from '../../assets/models'
import { Measurements, Measurement } from '../../assets/measurements'

import '../../css/ridedetails.css'
import AddMeasBtn from "./AddMeasBtn";
import Renderers from "../../assets/renderers";

type Props = {
    metas: RideMeta[],
	measurementClick: (measIndex: number, isChecked: boolean) => void
};

const RideDetails: FC<Props> = ( { metas, measurementClick } ) => {

    return (
		<div className="meta-data">
			{
				Measurements.map( (m: Measurement, i: number) =>
					<Checkbox 
						key={`ride-md-checkbox-${i}`}
						className='ride-metadata-checkbox'
						content={`${m.name} <p className="checkbox-subtitle">- ${Renderers[m.rendererIndex].name}</p>`}
						onClick={(isChecked) => measurementClick(i, isChecked)} />
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