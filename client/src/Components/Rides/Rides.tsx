import { FC, useEffect, useState } from "react";
import { Palette } from "react-leaflet-hotline";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { GraphProvider } from "../../context/GraphContext";
import { useMetasCtx } from "../../context/MetasContext";
import { ZoomProvider } from "../../context/ZoomContext";

import { RideMeasurement } from "../../models/properties";
import { MeasMetaPath, PointData } from "../../models/path";

import { GraphData } from "../../assets/graph/types";

import { getRide } from "../../queries/rides";

import { RENDERER_PALETTE } from "../Map/constants";
import Graph from "../Graph/Graph";
import RidesMap from "./RidesMap";
import usePopup from "../Popup";

const Rides: FC = () => {
    
    const { selectedMetas } = useMetasCtx()
    const { selectedMeasurements } = useMeasurementsCtx()

    const popup = usePopup(undefined).fire

    const [ palette, setPalette ] = useState<Palette>(RENDERER_PALETTE)
    const [ paths, setPaths ] = useState<MeasMetaPath>({})

    useEffect( () => {

        const updatePaths = async () => {
            const temp = {} as MeasMetaPath;

            for ( let meas of selectedMeasurements )
            {
                const { name } = meas
                temp[name] = {}

                for ( let meta of selectedMetas )
                {
                    const { TaskId } = meta;
    
                    if ( Object.hasOwn(paths, name) && Object.hasOwn(paths[name], TaskId) )
                        temp[name][TaskId] = paths[name][TaskId]
                    else {
                        const bp = await getRide(meas, meta, popup)
                        if ( bp !== undefined )
                            temp[name][TaskId] = bp;
                    }
                } 
            }

            return temp;
        }
        
        updatePaths().then( setPaths )

    }, [selectedMetas, selectedMeasurements] )

    return (
        <ZoomProvider>
        <GraphProvider>
            <div className="map-container">

                <RidesMap
                    paths={paths} 
                    selectedMetas={selectedMetas} 
                    selectedMeasurements={selectedMeasurements} 
                    palette={palette}
                    setPalette={setPalette} />

                { selectedMeasurements.map( (measurement: RideMeasurement, i: number) => measurement.hasValue && 
                    <Graph 
                        key={`graph-${i}`}
                        labelX="Time (absolute)" 
                        labelY={measurement.name}
                        absolute={true}
                        time={true}
                        palette={palette}
                        plots={ Object.entries(paths[measurement.name] || {})
                            .map( ([TaskId, bp], j) => {
                                const { path, bounds } = bp;

                                const data: GraphData = path.map( (p: PointData, k: number) => 
                                    [p.metadata.timestamp, p.value || 0, k]
                                )
                                return { data, bounds, label: 'r-' + TaskId, j }
                            } ) 
                        }
                    />
                ) }
            </div>
        </GraphProvider>
        </ZoomProvider>
  )
}

export default Rides;
