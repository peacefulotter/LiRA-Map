import { Card, CardContent, Grid } from '@mui/material';


import RideCardsA from './RideCardsA';
import RideDetailsA from './RideDetailsA';
import MeasurementTypes from './MeasurementTypes';

export default function RidesPopup() {
	return (
		<Card sx={{
			zIndex: 1000,
			position: 'absolute',
			width: 450,
			height: 700,
		}}>
			<CardContent>
				<Grid container spacing={2}>
					<Grid item xs={12} sx={{ background: 'blue' }}>
						<MeasurementTypes/>
					</Grid>
					<Grid item xs={6} sx={{ background: 'red' }}>
						<RideCardsA />
					</Grid>
					<Grid item xs={6} sx={{ background: 'green' }}>
						<RideDetailsA />
					</Grid>
				</Grid>
				{/*<RideCardsA />*/}
				{/*<RideDetailsA />*/}
			</CardContent>
		</Card>
	);
}