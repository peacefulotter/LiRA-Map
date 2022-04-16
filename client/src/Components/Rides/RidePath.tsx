
import { FC, useEffect, useState } from "react";

import MetadataPath from "../Map/MetadataPath";
import usePopup from "../Popup";

import { DataPath } from "../../models/path";
import { PopupFunc } from "../../models/popup";
import { RideMeasurement } from "../../models/properties";

import { getRide } from "../../queries/rides";
import { useKeyPaths } from "../../context/PathsContext";
import { RideMeta } from "../../models/models";
import { Data } from "ws";

interface Props {
    meta: RideMeta
    meas: RideMeasurement;
}

const RidePath: FC<Props> = ( { meta, meas } ) => {

    const { TripId, TaskId } = meta;

    const [dataPath, setDataPath] = useState<DataPath>()
    const { addKeyPath, remKeyPath } = useKeyPaths()

    const popup: PopupFunc = usePopup()

    useEffect( () => {

        getRide(meas, popup, TripId, TaskId, (dp: DataPath) => {
            setDataPath(dp)
            addKeyPath(meas, meta, dp)
        })

        return () => {
            remKeyPath(meas, meta)
        }
        
    }, [meas] )
    
    return dataPath !== undefined 
        ? <MetadataPath dataPath={dataPath} properties={meas} />
        : null
}

export default RidePath;
