import { FC, useState } from "react";
import { FiSettings } from 'react-icons/fi'

import useMeasPopup from "./MeasPopup";
import Checkbox from "../Checkbox";
import MetaData from "./MetaData";

import { DEFAULT_COLOR } from "../../assets/properties";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { Measurement, RideMeasurement } from "../../models/properties";
import { RendererName } from "../../models/renderers";
import { addMeasurement, editMeasurement } from "../../queries/measurements";

import '../../css/ridedetails.css'
import { useMetasCtx } from "../../context/MetasContext";


const RideDetails: FC = () => {

	const { metas, selectedMetas } = useMetasCtx()

	const { measurements, setMeasurements } = useMeasurementsCtx()
	const [ addChecked, setAddChecked ] = useState<boolean>(false)
	
	const popup = useMeasPopup({
		rendererName: RendererName.circles,
		name: '',
		dbName: '',
		isActive: false
	})

	const openEditMeasurement = (e: any, i: number) => {
		e.preventDefault()
		e.stopPropagation()
		
		const m = measurements[i]

		popup.fire( 
			(newMeasurement: RideMeasurement) => {
				const temp = measurements
					.map( (m: RideMeasurement, j: number) => i === j ? newMeasurement : m )
				setMeasurements( temp )
				editMeasurement(newMeasurement, i)
			}, 
			{ name: m.name, tag: m.dbName, renderer: m.rendererName, color: m.color || DEFAULT_COLOR } 
		)
	}

	const getMeasurementsContent = (m: Measurement, i: number): JSX.Element =>
		<div className="checkbox-container">
			<div className="checkbox-text">
				<div className="checkbox-title">{m.name}</div>
				<p className="checkbox-subtitle">- {m.rendererName}</p>
			</div>
			<FiSettings className="edit-meas-btn btn" onClick={(e) => openEditMeasurement(e, i)} strokeWidth={1}/>
		</div>


	const showAddMeasurement = () => {
		setAddChecked(true) 
		popup.fire( 
			(newMeasurement: RideMeasurement ) => {
				setAddChecked(false) 
				// update the state in RideDetails
				setMeasurements( prev => [...prev, newMeasurement])
				// and add the measurement to the measurements.json file
				addMeasurement(newMeasurement);
			},
			{ name: '', tag: '', renderer: RendererName.circles, color: '#bb55dd' } 
		)
	}

    const measurementClicked = (measIndex: number, isChecked: boolean) => {        
        const temp = [...measurements]
        temp[measIndex].isActive = isChecked
        setMeasurements(temp)
    }

    return (
		<div className="meta-data">
			{
				measurements.map( (m: Measurement, i: number) =>
					<Checkbox 
						key={`ride-md-checkbox-${i}`}
						className='ride-metadata-checkbox'
						html={getMeasurementsContent(m, i)}
						onClick={(isChecked) => measurementClicked(i, isChecked)} />
				)
			}

			<Checkbox 
				className='ride-metadata-checkbox md-checkbox-add'
				html={<div>+</div>}
				forceState={addChecked}
				onClick={showAddMeasurement} />
			
			
			{ selectedMetas.map( (isSelected: boolean, i: number) =>
				isSelected 
					? <MetaData md={metas[i]} key={`md-${Math.random()}`} />
					: null
			) }
        </div>
  )
}

export default RideDetails;