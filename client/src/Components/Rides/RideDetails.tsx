import { FC } from "react";

import MetaData from "./MetaData";
import Checkbox from "../Checkbox";

import { RideMeta } from '../../assets/models'
import { Measurement } from './Measurements'

import '../../css/ridedetails.css'
import AddMeasBtn from "./AddMeasBtn";
import Renderers from "../../assets/renderers";

type Props = {
	measurements: Measurement[];
	setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
    metas: RideMeta[];
	measurementClick: (measIndex: number, isChecked: boolean) => void;
};

const RideDetails: FC<Props> = ( { measurements, setMeasurements, metas, measurementClick } ) => {

    return (
		<div className="meta-data">
			{
				measurements.map( (m: Measurement, i: number) =>
					<Checkbox 
						key={`ride-md-checkbox-${i}`}
						className='ride-metadata-checkbox'
						content={`${m.name} <p className="checkbox-subtitle">- ${Renderers[m.rendererIndex].name}</p>`}
						onClick={(isChecked) => measurementClick(i, isChecked)} />
				)
			}

			<AddMeasBtn setMeasurements={setMeasurements}/>
			
			{ metas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`ride-md-${meta.TaskId}-${i}`}></MetaData>
			) }
        </div>
  )
}

export default RideDetails;