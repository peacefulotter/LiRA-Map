
import { useEffect, useState } from 'react'
import { RideMeasurement } from '../../models/properties'

import { getMeasurements } from '../../queries/measurements'
	
export const useMeasurements = (): [RideMeasurement[], React.Dispatch<React.SetStateAction<RideMeasurement[]>>] => {
	const [ measurements, setMeasurements ] = useState<RideMeasurement[]>([])

	useEffect( () => getMeasurements(setMeasurements), [])

	return [measurements, setMeasurements];
}


export default useMeasurements;