import { FC } from "react";

import Ride from "./Ride";
import { RideMeta } from "../../models/models";
import { useMetasCtx } from "../../context/MetasContext";



const Rides: FC = () => {
    
    const { metas, selectedMetas } = useMetasCtx();

    // const onChange = useCallback((id, value) => {
    //     setRides(rides.map((i: number, index: number) => metas[i]))
    // }, [rides])

    return (
        <>
        { metas.map( (meta: RideMeta, i: number) =>
            selectedMetas[i] 
                ? <Ride key={`Ride-${i}`} meta={meta} />
                : null
        ) }
        </>
  )
}

export default Rides;
