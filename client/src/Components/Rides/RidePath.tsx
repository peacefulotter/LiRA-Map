
import { FC, useEffect, useState } from "react";

import MetadataPath from "../Map/MetadataPath";
import usePopup from "../Popup";

import { PopupFunc } from "../../models/popup";
import { RideMeasurement } from "../../models/properties";

import { getRide } from "../../queries/rides";
import { useKeyPaths } from "../../context/PathsContext";
import { RideMeta } from "../../models/models";
import { Data } from "ws";
import { BoundedPath, Path } from "../../models/path";

interface Props {
    meta: RideMeta
    meas: RideMeasurement;
}

const RidePath: FC<Props> = ( { meta, meas } ) => {

    const { TripId, TaskId } = meta;

    const [bpath, setBPath] = useState<BoundedPath>()
    const { addKeyPath, remKeyPath } = useKeyPaths()

    const popup: PopupFunc = usePopup()

    useEffect( () => {

        getRide(meas, popup, TripId, TaskId, (bp: BoundedPath) => {
            setBPath(bp)
            console.log(meas);
            
            if ( meas.hasValue )
                addKeyPath(meas, meta, bp)
        })

        return () => {
            //remKeyPath(meas, meta)
        }
        
    }, [meas] )
    
    return bpath !== undefined 
        ? <MetadataPath path={bpath.path} properties={meas} />
        : null
}

export default RidePath;
