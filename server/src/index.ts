
import express from "express";
import "./models/RoadModel"

const PORT = process.env.PORT || 3001;

const app = express();


app.get("/api", (req, res) => {
  const a: RoadModel = {x: 1, y: 2}
  res.json(a);
});

app.listen(PORT, () => {
   // tslint:disable-next-line:no-console
  console.log(`Server listening on ${PORT}`);
});
