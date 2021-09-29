
import express from "express";
import { RoadCondition } from "./models/RoadCondition";
import { RoadModel } from "./models/RoadModel"

const PORT = process.env.PORT || 3001;

const app = express();


app.get("/api", (req, res) => {
  const roadData: RoadModel = {
    x: [55.78375070321902, 55.78, 55.78, 55.783],
    y: [2172.519382460705, 2172.52, 2172.53, 2172.52],
    condition: [RoadCondition.Good, RoadCondition.Correct, RoadCondition.Bad]
  }
  res.json(roadData);
});

app.listen(PORT, () => {
   // tslint:disable-next-line:no-console
  console.log(`Server listening on ${PORT}`);
});
