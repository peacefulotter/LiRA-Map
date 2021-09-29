import React, { FC, useState, useEffect } from "react";
import Map from "./Components/Map"
import { RoadModel } from './assets/models'
import "./App.css";



const App: FC = () => {
  const [data, setData] = useState<RoadModel | undefined>(undefined);

  useEffect( () => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data as RoadModel);
      })
  }, [] );

  return (
    <div className="App">
      <div className="map-wrapper">
        <Map roadStatus={data}/>
      </div>
    </div>
  );
}

export default App;