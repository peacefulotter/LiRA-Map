import React, { FC, useState } from 'react';

import useMeasPopup from './Popup/useMeasPopup';
import Checkbox from '../Checkbox';

import { useMeasurementsCtx } from '../../context/MeasurementsContext';

import { addMeasurement } from '../../queries/measurements';
import { ActiveMeasProperties } from '../../models/properties';

import { RENDERER_MEAS_PROPERTIES } from '../Map/constants';

import MeasCheckbox from './MeasCheckbox';
import { Autocomplete, FormControl, TextField } from '@mui/material';


const MeasurementTypes: FC = () => {
	const { measurements, setMeasurements } = useMeasurementsCtx();
	const [addChecked, setAddChecked] = useState<boolean>(false);

	const popup = useMeasPopup();

	const editMeasurement = (meas: ActiveMeasProperties, i: number) => (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		popup(
			(newMeas: ActiveMeasProperties) => {
				const temp = [...measurements];
				temp[i] = newMeas;
				setMeasurements(temp);
			},
			{ ...RENDERER_MEAS_PROPERTIES, ...meas },
		);
	};

	const showAddMeasurement = () => {
		setAddChecked(true);
		popup(
			(newMeasurement: ActiveMeasProperties) => {
				setAddChecked(false);
				// update the state in RideDetails
				setMeasurements(prev => [...prev, newMeasurement]);
				// and add the measurement to the measurements.json file
				addMeasurement(newMeasurement);
			},
			RENDERER_MEAS_PROPERTIES,
		);
	};

	const selectMeasurement = (i: number) => (isChecked: boolean) => {
		const temp = [...measurements];
		temp[i].isActive = isChecked;
		setMeasurements(temp);
	};
	const filters = ['Track position', 'Interpolation', 'Engine RPM'];

	return (
		<FormControl variant='standard' fullWidth={true}>
			<Autocomplete
				multiple
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						label='Measurement types'
					/>
				)} options={filters}
			/>
		</FormControl>
		// <div className='meta-data'>
		// 	<div style={{ height: 350, overflow: 'scroll' }}>
		//
		// 		{measurements.map((m: ActiveMeasProperties, i: number) =>
		// 			<MeasCheckbox
		// 				key={`meas-checkbox-${i}`}
		// 				meas={m}
		// 				selectMeasurement={selectMeasurement(i)}
		// 				editMeasurement={editMeasurement(m, i)} />,
		// 		)}
		// 	</div>
		//
		// 	<Checkbox
		// 		className='ride-metadata-checkbox md-checkbox-add'
		// 		html={<div>+</div>}
		// 		forceState={addChecked}
		// 		onClick={showAddMeasurement} />
		// </div>
	);
};

export default MeasurementTypes;