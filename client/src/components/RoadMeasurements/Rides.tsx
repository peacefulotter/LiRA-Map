import { FC, useEffect, useState } from "react";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { GraphProvider } from "../../context/GraphContext";
import { useMetasCtx } from "../../context/MetasContext";

import { ActiveMeasProperties } from "../../models/properties";
import {MeasMetaPath, PointData /*, PointData*/} from "../../models/path";

//import { GraphData, GraphPoint } from "../../assets/graph/types";

import { getRide } from "../../queries/rides";

//import Graph from "../Graph/Graph";
import RidesMap from "./RidesMap";
import usePopup from "../createPopup";
import RideGraphCard, {IRideGraphCard} from "./RideGraphCard";

const Rides: FC = () => {
    
    const { selectedMetas } = useMetasCtx()
    const { selectedMeasurements } = useMeasurementsCtx()

    const [ paths, setPaths ] = useState<MeasMetaPath>({})
    const [ graphData, setGraphData ] = useState<[string, number][]>()
    const [ graphType, setGraphType] = useState<string>()

    useEffect(() => {
        if (!selectedMeasurements || selectedMeasurements.length === 0) {
            //console.log("Returned")
            setGraphData(undefined)
            return
        }
        //console.log("Selected Measurements\n");
        //console.log(selectedMeasurements);

        const { hasValue, name }: ActiveMeasProperties = selectedMeasurements[0]
        if (!hasValue) {
            //console.log("Returned")
            setGraphData(undefined)
            return
        }
        //console.log("Name\n")
        //console.log(name)

        if(!paths[name] || Object.keys(paths[name]).length === 0) {
            //console.log("Returned")
            setGraphData(undefined)
            return
        }
        //console.log("Paths\n")
        //console.log(paths[name])

        const o = Object.values(paths[name])[0]
        //console.log("Object\n")
        //console.log(o)

        const { path } = o

        //console.log("Data\n")
        //console.log(path)

        // Date format
        const date_format = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const data = path.map(o => {
            const t: [string, number] = [date_format.format(new Date(o.metadata.timestamp)), o.value ? o.value : 0]
            return t
        })

        //console.log("Mapped\n")
        //console.log(map1)

        setGraphType(name)
        setGraphData(data)
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

                <RideGraphCard type={graphType} data={graphData}/>
            </div>
        </GraphProvider>
  )
}

export default Rides;