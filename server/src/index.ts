
import express from "express";
import { RoadSegments, RoadCondition } from './models'

const PORT = process.env.PORT || 3001;

const app = express();


app.get("/rides", (req, res) => {
  const roadData: RoadSegments = [
    { path: [ 
      { lat: 55.78375070321902, lng: 2172.519382460705 }, 
      { lat: 55.78,             lng: 2172.52 } 
    ],
      condition: RoadCondition.Good
    },

    { path: [ 
      { lat: 55.78,  lng: 2172.53 }, 
      { lat: 55.783, lng: 2172.52 } 
    ],
      condition: RoadCondition.Correct
    },
  ]

  res.json(roadData);
});


app.listen(PORT, () => {
   // tslint:disable-next-line:no-console
  console.log(`Server listening on ${PORT}`);
});
