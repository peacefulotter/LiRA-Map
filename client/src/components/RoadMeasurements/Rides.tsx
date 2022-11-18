import { FC, useEffect, useState } from "react";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { GraphProvider } from "../../context/GraphContext";
import { useMetasCtx } from "../../context/MetasContext";

import { ActiveMeasProperties } from "../../models/properties";
import { MeasMetaPath /*, PointData*/ } from "../../models/path";

//import { GraphData, GraphPoint } from "../../assets/graph/types";

import { getRide } from "../../queries/rides";

//import Graph from "../Graph/Graph";
import RidesMap from "./RidesMap";
import usePopup from "../createPopup";
import RideGraphCard, {IGraph} from "./RideGraphCard";

const Rides: FC = () => {
    
    const { selectedMetas } = useMetasCtx()
    const { selectedMeasurements } = useMeasurementsCtx()

    const [ paths, setPaths ] = useState<MeasMetaPath>({})
    const [ data, setData ] = useState<IGraph[]>()

    useEffect(() => {
        if (!selectedMeasurements || selectedMeasurements.length === 0) {
            console.log("Returned")
            setData(undefined)
            return
        }
        console.log("Selected Measurements\n");
        console.log(selectedMeasurements);

        const { hasValue, name }: ActiveMeasProperties = selectedMeasurements[0]
        if (!hasValue) {
            console.log("Returned")
            setData(undefined)
            return
        }
        console.log("Name\n")
        console.log(name)

        if(!paths[name] || Object.keys(paths[name]).length === 0) {
            console.log("Returned")
            setData(undefined)
            return
        }
        console.log("Paths\n")
        console.log(paths[name])

        const o = Object.values(paths[name])[0]
        console.log("Object\n")
        console.log(o)

        const { path } = o

        console.log("Data\n")
        console.log(path)

        setData(path.map(o => {
            const time: string = Object(Object(o)["metadata"])["timestamp"];
            const val: number = Object(o)["value"];
            const data: IGraph = {x: time, y: val};
            return data
        }))
    }, [selectedMeasurements, paths]);

    const popup = usePopup()

    useEffect( () => {
        const updatePaths = async () => {
            const temp = {} as MeasMetaPath;

            for ( let meas of selectedMeasurements ) {
                const { name } = meas
                temp[name] = {}

                for ( let meta of selectedMetas ) {
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
        <GraphProvider>
            <div className="map-container">

                <RidesMap
                    paths={paths} 
                    selectedMetas={selectedMetas} 
                    selectedMeasurements={selectedMeasurements}  />

                <RideGraphCard data={data}/>

                {/*
                { selectedMeasurements.map( ({hasValue, name, palette}: ActiveMeasProperties, i: number) => hasValue &&

                    <Graph
                        key={`graph-${i}`}
                        labelX="Time (h:m:s)" 
                        labelY={name}
                        absolute={true}
                        time={true}
                        palette={palette}
                        plots={ Object.entries(paths[name] || {})
                            .map( ([TaskId, bp], j) => {
                                const { path, bounds } = bp;
                                const x = (p: PointData) => new Date(p.metadata.timestamp).getTime()
                                const data: GraphData = path
                                    .map( p => [x(p), p.value || 0] as GraphPoint )
                                    .sort( ([x1, y1], [x2, y2]) => (x1 < x2) ? -1 : (x1 === x2) ? 0 : 1 )
                                return { data, bounds, label: 'r-' + TaskId, j }
                            } ) 
                        }
                    />
                ) }
                */}
            </div>
        </GraphProvider>
  )
}

export default Rides;