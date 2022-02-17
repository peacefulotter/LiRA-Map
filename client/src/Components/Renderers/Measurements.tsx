
import { useEffect, useState } from 'react'
import { get, put } from '../../assets/fetch'
import { Measurement } from '../../assets/models'
	
export const useMeasurements = (): [Measurement[], React.Dispatch<React.SetStateAction<Measurement[]>>] => {
	const [ measurements, setMeasurements ] = useState<Measurement[]>([])

	useEffect( () => {
		get('/measurements', (data) => {
			setMeasurements(data);
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