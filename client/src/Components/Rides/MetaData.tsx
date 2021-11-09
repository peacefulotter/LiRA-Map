import { FC } from "react";

import { RideMeta } from '../../assets/models'

import '../../css/ridedetails.css'


type Props = {
    md: RideMeta,
};

//print all necessary meta info with a map function here
const MetaData: FC<Props> = ( { md } ) => {
    return (
        <>
		<div className="ride-metadata-separation"></div>
        <div className="ride-metadata-list" >
            { Object.entries(md).map( (elt, i) => 
                <div className="ride-metadata-elt" key={'metadata-' + i}><b>{elt[0]}</b>: {elt[1]} </div>
            ) }
        </div>
        </>
    )
    
}

export default MetaData;