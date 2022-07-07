
import { FC, useEffect, useState } from "react";

import MetadataPath from "../Map/MetadataPath";
import usePopup from "../Popup";

import { useKeyPaths } from "../../context/PathsContext";

import { PopupFunc } from "../../models/popup";
import { RideMeasurement } from "../../models/properties";
import { RideMeta } from "../../models/models";
import { BoundedPath } from "../../models/path";

import { getRide } from "../../queries/rides";

interface Props {
    meta: RideMeta
    meas: RideMeasurement;
}

const RidePath: FC<Props> = ( { meta, meas } ) => {

    const { TripId, TaskId } = meta;

    const [bpath, setBPath] = useState<BoundedPath>()
    const { addKeyPath } = useKeyPaths()

    const popup: PopupFunc = usePopup(undefined).fire

    useEffect( () => {

        getRide(meas, popup, TripId, TaskId, (bp: BoundedPath) => {
            setBPath(bp)
            console.log(bp);
            
            if ( meas.hasValue )
                addKeyPath(meas, meta, bp)
        })

        return () => {
            //remKeyPath(meas, meta)
        }
        
    }, [meas, TripId, TaskId, meta] )
    
    return bpath !== undefined 
        ? <MetadataPath path={bpath.path} properties={meas} />
        : null
}

export default RidePath;
