const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const location = require("./db.js");

app.use(cors());

app.get("/locations", (req, res) => {
  return res.send({
    msg: "Hello",
  });
});

app.post("/locations", async (req, res) => {
  const { name, coords } = req.body;
  const newLocation = new Location({ name, coords });
  await newLocation.save();
  res.status(201).json(newLocation);
});

app.listen(4000, () => {
  console.log("Server listening on port 3000");
});
