
import { useEffect, useState } from 'react'
import { get, put } from '../../assets/fetch'
import { Measurement, RideMeasurement } from '../../assets/models'
	
export const useMeasurements = (): [RideMeasurement[], React.Dispatch<React.SetStateAction<RideMeasurement[]>>] => {
	const [ measurements, setMeasurements ] = useState<RideMeasurement[]>([])
	
	useEffect( () => {
		get('/measurements', (data: Measurement[]) => {
			console.log(data);
			setMeasurements( data.map(meas => {
				return { ...meas, isActive: false }
			} ) );
		})
	}, [])

	return [measurements, setMeasurements];
}

export const addMeasurement = (measurement: Measurement) => {
	put('/addmeasurement', measurement)	
}

export const editMeasurement = (measurement: Measurement, index: number) => {
	put('/editmeasurement', { measurement: measurement, index: index } )	
}

export default useMeasurements;