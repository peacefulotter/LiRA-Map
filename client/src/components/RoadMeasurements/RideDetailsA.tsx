import React, { FC, useState } from 'react';

import Checkbox from '../Checkbox';
import MetaData from './MetaData';

import { useMetasCtx } from '../../context/MetasContext';
import { RideMeta } from '../../models/models';


const RideDetails: FC = () => {

	const { selectedMetas } = useMetasCtx();
	
	return (
		<div className='meta-data'>
			{/*<div style={{height:350, overflow:'scroll'}}>*/}
			{/*	*/}
			{/*{measurements.map((m: ActiveMeasProperties, i: number) =>*/}
			{/*	<MeasCheckbox*/}
			{/*		key={`meas-checkbox-${i}`}*/}
			{/*		meas={m}*/}
			{/*		selectMeasurement={selectMeasurement(i)}*/}
			{/*		editMeasurement={editMeasurement(m, i)} />,*/}
			{/*)}*/}
			{/*</div>*/}
			
			{/*<Checkbox*/}
			{/*	className='ride-metadata-checkbox md-checkbox-add'*/}
			{/*	html={<div>+</div>}*/}
			{/*	forceState={addChecked}*/}
			{/*	onClick={showAddMeasurement} />*/}

			
			{selectedMetas.map((meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`md-${Math.random()}`} />,
			)}
		</div>
	);
};

export default RideDetails;