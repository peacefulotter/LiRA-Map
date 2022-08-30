
import { useState } from "react";
import { ChartData, Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Palette } from "react-leaflet-hotline";

import ConditionsMap from "../Components/RoadConditions/ConditionsMap";
import ConditionsGraph from "../Components/RoadConditions/ConditionsGraph";

import { ConditionType } from "../models/graph";

import { GraphProvider } from "../context/GraphContext";

import "../css/road_conditions.css";
import { RENDERER_PALETTE } from "../Components/Map/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RoadConditions = () => {
    
    const [palette, setPalette] = useState<Palette>([])
    const [wayData, setWayData] = useState<ChartData<"line", number[], number>>()

    const type: ConditionType = {
        name: 'IRI',
        min: 0,
        max: 10,
        grid: true,
        samples: 40
    }

    return (
        <GraphProvider>
        <div className="ml-wrapper">
            <ConditionsMap type={type} palette={palette} setPalette={setPalette} setWayData={setWayData} />
            <ConditionsGraph type={type} palette={palette} data={wayData} />
        </div>

        </GraphProvider> 
    );
}

export default RoadConditions;