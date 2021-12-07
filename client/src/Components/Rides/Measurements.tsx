
import { useEffect, useState } from 'react'
import { get, put } from '../../assets/fetch'

export type Measurement = {
	rendererIndex: number;
	query: string;
	queryMeasurement?: string,
	name: string;
	defaultColor: string;
	size?: number;
	value?: string;
}
	
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
	put('/measurements', measurement)	
}

export default useMeasurements;