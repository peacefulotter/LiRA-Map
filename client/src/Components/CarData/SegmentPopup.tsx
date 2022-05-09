import { FC, useState, useEffect } from "react";
import { GetAggregationTypesOfSegment, GetDataTypesOfSegment, GetSegmentAndAggregateValue } from "../../queries/DataRequests";
import { SegmentProps } from "./Segment";

import '../../css/popupsegment.css'
import '../../css/rides.css'

export interface SegmentPopUpProps extends SegmentProps{
    updateSegment:(props: SegmentProps) => void;
}


const SegmentPopup: FC<SegmentPopUpProps> = ({id, positionA, positionB, way, count, type, aggregation, value, direction, updateSegment}) => {

    const [dataTypes, setDataTypes] = useState<string[]>([]);
    const [aggregationTypes, setAggregationTypes] = useState<string[]>([]);
    const [segmentProps, setSegmentProps] = useState<SegmentProps>();

    useEffect(() => {
        const fetchDataTypes = async (segment_id: number) => {
            console.log("fetching mew data types");
            let dataTypes = await GetDataTypesOfSegment(segment_id);
            setDataTypes(dataTypes);
        }
        const fetchAggregationTypes = async (segment_id: number, dataType: string) => {
            console.log("fetching " + dataType)
            let aggregationTypes = await GetAggregationTypesOfSegment(dataType, segment_id);
            console.log(aggregationTypes);
            setAggregationTypes(aggregationTypes);
        }
        fetchDataTypes(id);
        fetchAggregationTypes(id, type);
        console.log(direction)
        setSegmentProps({id, positionA, positionB, way, count, type, aggregation, value, direction})
    }, [id, positionA, positionB, way, count, type, aggregation, value, direction]);



    const GetDataOptions = () => {
        let index = -1;
    
        return dataTypes.map((element) => {
            index = index + 1;
            let color = '#9CADFF';

            return(<div style={{"backgroundColor": color}} className="scrollableItem" id={String(index)} onClick={((e) => dataTypeOnClick(e))}>
                {element}
            </div>)
        })
    }

    const dataTypeOnClick = async (e:any) =>{
        const element = e.target;
        if(segmentProps !== undefined)
            setSegmentProps(await GetSegmentAndAggregateValue(element.textContent, segmentProps?.aggregation, segmentProps?.id))
        
    }

    const aggregationTypeOnClick = async (e:any) =>{

        const element = e.target;
        if(segmentProps !== undefined)
            setSegmentProps(await GetSegmentAndAggregateValue(segmentProps?.type, element.textContent, segmentProps?.id))
            

    }

    const GetAggregationOptions = () => {
        let index = 1000;
        return aggregationTypes.map((element) => {
            index = index + 1;
            let color = '#9CADFF';

            return(<div style={{"backgroundColor": color}} className="scrollableItem" id={String(index)} onClick={((e) => aggregationTypeOnClick(e))}>
                {element}
            </div>)
        })
    }

    const activateDirection = () => {
        updateSegment({id, positionA, positionB, way, count, type, aggregation, value, direction:0})
    }

    const switchDirection = () => {

    }

    return(
        <div className="container-segment">
            <div className="content-segment">
                <div className="section">
                    <div className="subsection-segment">
                        <span className="title">Segment {segmentProps?.id}</span>
                        <button onClick={activateDirection}>activate direction</button>
                        <button onClick={switchDirection}>switch direction</button>
                    </div>
                    <div className="subsection">
                        <span className="way">Way {segmentProps?.way}</span>
                    </div>
                </div>
                <div className="section">
                    <div className="subsection">
                        <span className="data">{segmentProps?.aggregation} {segmentProps?.type} {segmentProps?.direction}:</span>
                    </div>
                    <div className="subsection">
                        <span className="value">{segmentProps?.value} Newtons</span>
                    </div>
                </div>
                <span className="data">More data types</span>
                <div className="dataScrollable">
                    {dataTypes !== undefined && GetDataOptions()}
                </div>
                <span className="data">More aggregations</span>
                <div className="dataScrollable">
                    {aggregationTypes !== undefined && GetAggregationOptions()}
                </div>
            </div>
        </div>
    );
}

export default SegmentPopup;