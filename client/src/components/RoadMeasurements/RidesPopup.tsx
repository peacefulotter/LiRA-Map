import { Card, CardContent, Grid } from '@mui/material';


import RideCardsA from './RideCardsA';
import RideDetailsA from './RideDetailsA';
import MeasurementTypes from './MeasurementTypes';
import OptionsSelector from './OptionsSelector';

export default function RidesPopup() {
	return (
		<Card sx={{
			zIndex: 1000,
			position: 'absolute',
			width: 450,
			height: 900,
		}}>
			<CardContent>
				<Grid container spacing={2}>
					<Grid item xs={12} sx={{ }}>
						<MeasurementTypes/>
					</Grid>
					<Grid item xs={12} sx={{  }}>
						<OptionsSelector/>
					</Grid>
					<Grid item xs={6} sx={{  }}>
						<RideCardsA />
					</Grid>
					<Grid item xs={6} sx={{  }}>
						<RideDetailsA />
					</Grid>
				</Grid>
				{/*<RideCardsA />*/}
				{/*<RideDetailsA />*/}
			</CardContent>
		</Card>
	);
}