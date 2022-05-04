import { FC, useState } from "react";
import { MeasurementData, SegmentInterface} from "../models/models";
import '../css/cardata.css'


import MapWrapper from "../Components/Map/MapWrapper";
import MapEvents from "../Components/CarData/MapEvents";
import Measurements from "../Components/CarData/Measurements";
import Segments, { SegmentsProps } from "../Components/CarData/Segments";
import { LatLng } from "leaflet";
import Filter from "../Components/CarData/Filter";
const CarData: FC = () => {

    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [boundaries, setBoundaries] = useState<LatLng[]>(
        [new LatLng(55.523966596348956, 12.030029296875002),
        new LatLng(55.523966596348956, 12.74620056152344),
        new LatLng(55.8089989927049, 12.74620056152344),
        new LatLng(55.8089989927049, 12.030029296875002)])
    const [dataType, setDataType] = useState<string>();
    const [aggregationType, setAggregationType] = useState<string>();
    const [showFilter, setShowFilter] = useState<Boolean>(false);

    const filterButtonOnClick = (e:any) => {
        setShowFilter(!showFilter);
    }


    return (
        <>
            <div className="ml-wrapper">
                {showFilter == true &&
                    <Filter setShowFilter = {setShowFilter} setSelectedAggregation={setAggregationType} setSelectedDataType={setDataType}></Filter>
                }
                <MapWrapper>
                    <button className="filter-button" onClick={filterButtonOnClick}>
                        Filter
                    </button>
                    {boundaries != undefined && dataType != undefined && aggregationType != undefined &&
                        <Segments boundaries={boundaries} type={dataType} aggregation={aggregationType} /> 
                    }
                    <MapEvents setMeasurements={setMeasurements} setBoundaries={setBoundaries}></MapEvents>        
                </MapWrapper>
            </div>
        </>
        
    );
}

export default CarData;