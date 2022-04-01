
import { useEffect, useState } from 'react'

import { Measurement, RideMeasurement } from '../../models/models'
import { get, put } from '../../queries/fetch'
import getMeasurements from '../../queries/measurements'
	
export const useMeasurements = (): [RideMeasurement[], React.Dispatch<React.SetStateAction<RideMeasurement[]>>] => {
	const [ measurements, setMeasurements ] = useState<RideMeasurement[]>([])

	useEffect( () => getMeasurements(setMeasurements), [])

	return [measurements, setMeasurements];
}

export const addMeasurement = (measurement: Measurement) => {
	put('/addmeasurement', measurement)	
}

export const editMeasurement = (measurement: Measurement, index: number) => {
	put('/editmeasurement', { measurement: measurement, index: index } )	
}

export default useMeasurements;