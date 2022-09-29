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

import "leaflet/dist/leaflet.css"
import {MapContainer} from "react-leaflet";
import "../css/map.css"
import "../css/rides.css"
import "../css/ridecard.css"
import "../css/ridedetails.css"

// ----------------------------------------------------------------------

export default function RoadMeasurement() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Road Measurement">
          <MeasurementsProvider>
              <MetasProvider>
                  <div className="rides-wrapper">

                      <RideCards />

                      <RideDetails  />

                      <Rides />

                  </div>
              </MetasProvider>
          </MeasurementsProvider>
    </Page>
  );
}

