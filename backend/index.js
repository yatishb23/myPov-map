const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const db=require("mongoose");
require('dotenv').config();

db.connect(`${process.env.DB_URL}`)

const locationSchema = new db.Schema({
  lat: Number,
  lng: Number,
  name: String,
  fontColor: String,
  font:String,
  zoom:Number
});

const Location = db.model('Location', locationSchema);

module.exports={
  Location
}
app.use(cors());
app.use(express.json());

app.get('/getLocations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching locations!' });
  }
});

app.post('/Location', async (req, res) => {
  const payload =  req.body;

  const location = new Location({
    lat:payload.lat,
    lng:payload.lng,
    name:payload.name,
    fontColor:payload.color,
    font:payload.font,
    zoom:payload.zoom
  });

  try {
    await location.save();
    res.status(200).send({ message: 'Location saved successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Error saving location!' });
  }
});

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
