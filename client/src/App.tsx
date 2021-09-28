import React from "react";
import Map from "./Components/Map"
import "./App.css";

interface RoadModel {
  x : number,
  y : number
}

function App() {
  const [data, setData] = React.useState<RoadModel>({x: 0, y: 0});

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data as RoadModel);
      })
  }, []);

  return (
    <div className="App">
      <div className="Map">
      <Map position={data}/>
      </div>
      <p>{!data ? "Loading..." : data.x}</p>
      <p>{!data ? "Loading..." : data.y}</p>
    </div>
  );
}

export default App;