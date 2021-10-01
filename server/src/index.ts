
import express from "express";
import { RoadCondition } from "./models/RoadCondition";
import { RoadModel } from "./models/RoadModel"

const PORT = process.env.PORT || 3001;

const app = express();


app.get("/api", (req, res) => {
  const roadData: RoadModel = {
    paths: [
      [ [55.78375070321902, 2172.519382460705],
        [55.78,             2172.52] ],
      [ [55.78,             2172.53],
        [ 55.783,           2172.52] ]
    ],
    conditions: [RoadCondition.Good, RoadCondition.Correct, RoadCondition.Bad]
  }
  res.json(roadData);
});

app.listen(PORT, () => {
   // tslint:disable-next-line:no-console
  console.log(`Server listening on ${PORT}`);
});
