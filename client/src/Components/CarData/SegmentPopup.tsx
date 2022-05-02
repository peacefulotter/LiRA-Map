import { FC, useState, useEffect } from "react";
import { Marker } from 'react-leaflet'

import '../../css/rides.css'
import '../../css/popupsegment.css'
import { SegmentProps } from "../../models/models";
import { GetEnergyConsumptionDataFromSegment } from "../../queries/DataRequests";


export interface PopUpInformation{
    segmentId: Number;
    segmentWay: Number;
    segmentLength: Number;
    segmentAngle: Number;
    tractionForce: Number;
    inertialForce: Number;
    hillClimbingForce: Number;
}


const SegmentPopup: FC<SegmentProps> = (props) => {

    const [information, setInformation] = useState<PopUpInformation>();


    useEffect(() => {
        // Create an scoped async function in the hook
        async function fetchData() {
            await GetEnergyConsumptionDataFromSegment(props.id)
            .then(res => {
                console.log(res);
                setInformation(res);
            });
        }
      // Execute the created function directly
      fetchData();
    }, [props.id]);

    return(
        <div className="segmentPopup">
            <div className="segmentPopup-inner">
                <h2 className="title">Details</h2>
                <div>
                    <h3 className="subtitle">General information</h3>
                    <div className="element-div">
                        <p className="element">Segment ID: </p>
                        <p className="element">{information?.segmentId}</p>
                    </div>
                    <div className="element-div">
                        <p className="element">Way: </p>
                        <p className="element">{information?.segmentWay}</p>
                    </div>
                    <div className="element-div">
                        <p className="element">Length: </p>
                        <p className="element">{information?.segmentLength}</p>
                    </div>
                    <div className="element-div">
                        <p className="element">Inclination angle: </p>
                        <p className="element">{information?.segmentAngle}</p>
                    </div>
                </div>
                <div>
                    <h3 className="subtitle">Energy consumption</h3>
                    <div style={{"justifyContent":"center", "padding":"0px"}} className="element-div">
                        <p className="element">Ft = Fhc + Faero + Fi + Fcc</p>
                    </div>
                    <div className="element-div">
                        <p className="element">Avg traction force: </p>
                        <p className="element">{information?.tractionForce}</p>
                    </div>
                    <div className="element-div">
                        <p className="element">Avg inertial force: </p>
                        <p className="element">{information?.inertialForce}</p>
                    </div>
                    <div className="element-div">
                        <p className="element">Hill climbing force: </p>
                        <p className="element">{information?.hillClimbingForce}</p>
                    </div>
                    <div className="element-div">
                        <p className="element">Aerodynamic drag: </p>
                        <p className="element">?</p>
                    </div>
                    <div className="element-div">
                        <p className="element">Rolling resistance force: </p>
                        <p className="element">?</p>
                    </div>
                </div>
                
            </div>

        </div>
    );
}

export default SegmentPopup;