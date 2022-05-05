import { FC, useState } from "react";

import MapWrapper from "../Map/MapWrapper";
import Graph from "../Graph/Graph";
import RidePath from "./RidePath";

import { useMetasCtx } from "../../context/MetasContext";
import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { useKeyPaths } from "../../context/PathsContext";

import { RideMeasurement } from "../../models/properties";
import { PointData } from "../../models/path";
import { RideMeta } from "../../models/models";
import { GraphData } from "../../models/graph";

const Rides: FC = () => {
    
    const { metas, selectedMetas } = useMetasCtx()
    const { measurements } = useMeasurementsCtx()
    const { paths } = useKeyPaths()

    const _metas = metas.filter( (m: RideMeta, i: number) => selectedMetas[i] )
    const _measurements = measurements.filter( (m: RideMeasurement) => m.isActive )

    console.log(paths);
    console.log(_metas);
    console.log(_measurements);
    

    return (
        <div className="map-container">
            <MapWrapper>
                { _metas.map( (meta: RideMeta, i: number) =>
                    _measurements.map( (meas: RideMeasurement, j: number) =>
                        <RidePath 
                            key={`RidePath-${i}-${j}`}
                            meas={meas}
                            meta={meta} 
                        />
                    )
                ) }
            </MapWrapper>
            {
                _measurements.map( (meas: RideMeasurement, i: number) => 
                    <Graph 
                        key={"graph-"+i}
                        labelX="time (?)" 
                        labelY={meas.name}
                        plots={ 
                            paths.hasOwnProperty(meas.name) 
                                ? Object.entries(paths[meas.name]).map( ([taskId, dp], i: number) => {
                                    const { path, bounds } = dp;
                                    const minX = 0
                                    const maxX = path.length - 1
                                    console.log(minX, maxX, bounds?.minY, bounds?.maxY);
                                    // p.metadata.timestamp - minX
                                    const data: GraphData = path.map((p: PointData, i:number) => [i, p.value || 0, i])
                                    console.log(data);
                                    const _bounds = {
                                        minX, maxX, minY: bounds?.minY, maxY: bounds?.maxY
                                    }
                                    
                                    return { data, bounds: _bounds, label: 'r-' + taskId, i }
                                } ) 
                                : undefined 
                        }
                    />
                )
            }
            
        </div>
  )
}

export default Rides;
