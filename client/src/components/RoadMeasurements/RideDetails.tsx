import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Card, FormControl, ListItem, Stack, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../store';
import RideListComponent from './RideListComponent';
import RideListComponentDetails from './RideListComponentDetails';
import { Ride } from '../../models/ride';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


export default function RideDetails() {
	const filters = ['Track position', 'Interpolation', 'Engine RPM'];
	const [dateFrom, setDateFrom] = React.useState<Date | null>(() => new Date(Date.now()));
	const [dateTo, setDateTo] = React.useState<Date | null>(() => new Date(Date.now()));
	const dispatch = useDispatch<Dispatch>();

	const [selectedRide, setSelectedRide] = useState<Ride>({});

	let rides = useSelector(
		(state: RootState) => state.rides,
	);

	useEffect(() => {
		dispatch.rides.fetchRides();
	}, [dispatch.rides]);

	const handleChangeTo = (newDate: Date) => {
		setDateTo(newDate);
	};

	return (
		<Card sx={{
			zIndex: 1000,
			width: 350,
			height: 710,
			position: 'absolute',
			padding: 2,
			spacing: 2
		}}>
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
			<Stack justifyContent='space-between' direction='row'>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						label='From'
						value={dateFrom}
						onChange={(newDate) => {
							setDateFrom((newDate));
						}}
						renderInput={(params: any) => <TextField variant='standard'
																 sx={{ maxWidth: 125 }}{...params} />}
					/>
					<DatePicker
						label='To'
						value={dateTo}
						onChange={(newDate) => {
							setDateTo(newDate);
						}}
						renderInput={(params: any) => <TextField variant='standard'
																 sx={{ maxWidth: 125 }}{...params} />}
					/>
				</LocalizationProvider>
			</Stack>
			<Stack direction='row' style={{ maxHeight: '86%', overflow: 'auto' }}>
				<Box>
					{
						rides?.map((ride) => {
							return <ListItem onClick={() => {
								setSelectedRide(ride);
							}}>
								<RideListComponent ride={ride} />
							</ListItem>;
						})
					}
				</Box>
				{
					selectedRide.TripId && <RideListComponentDetails ride={selectedRide} />
				}
			</Stack>
		</Card>
	);
}
