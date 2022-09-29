// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';

import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";

import RideDetails from "../components/RoadMeasurements/RideDetails";
import RideCards from "../components/RoadMeasurements/RideCards";
import Rides from "../components/RoadMeasurements/Rides";

// ----------------------------------------------------------------------

export default function RoadMeasurement() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Road Measurement">
      <Container maxWidth={themeStretch ? false : 'xl'}>
          <MeasurementsProvider>
              <MetasProvider>
                  <div className="rides-wrapper">

                      <RideCards />

                      <RideDetails  />

                      <Rides />

                  </div>
              </MetasProvider>
          </MeasurementsProvider>
      </Container>
    </Page>
  );
}

