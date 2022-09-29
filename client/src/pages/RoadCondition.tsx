// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';

import { useState } from "react";
import { Palette } from "react-leaflet-hotline";
import { ChartData } from "chart.js";

import ConditionsMap from "../components/RoadConditions/ConditionsMap";
import ConditionsGraph from "../components/RoadConditions/ConditionsGraph";

import { ConditionType } from "../models/graph";

import { GraphProvider } from "../context/GraphContext";

// ----------------------------------------------------------------------

export default function RoadCondition() {
  const { themeStretch } = useSettings();

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
    <Page title="Road Condition">
      <Container maxWidth={themeStretch ? false : 'xl'}>
          <GraphProvider>
              <div className="road-conditions-wrapper">
                  <ConditionsMap type={type} palette={palette} setPalette={setPalette} setWayData={setWayData} />
                  <ConditionsGraph type={type} palette={palette} data={wayData} />
              </div>
          </GraphProvider>
      </Container>
    </Page>
  );
}
