import React, { FC } from 'react';
import MetaData from './MetaData';

import { useMetasCtx } from '../../context/MetasContext';
import { RideMeta } from '../../models/models';


const RideDetails: FC = () => {

	const { selectedMetas } = useMetasCtx();

	return (
		<div className='meta-data'>
			{selectedMetas.map((meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`md-${Math.random()}`} />,
			)}
		</div>
	);
};

export default RideDetails;