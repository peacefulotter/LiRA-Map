
import express from "express";

import { db } from './database'

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json({
  type: ['application/json', 'text/plain']
}))



// app.get("/measurements", (req, res) => {
//   const data: MeasurementsModel = [ "Track Position", "Interpolation", "Map Matching" ]
//   res.json(data);
// });


db(app);



app.post("/login",(req,res) => {
  const body = req.body;
  const user = body.username;
  const email = body.email;
  const pass = body.password;

  // do something with the credentials

  res.json( { status: "ok" } );
});


app.listen(PORT, () => {
  	console.log(`Server listening on ${PORT}`);
});
