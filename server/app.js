const express = require("express");
const cors = require("cors");
const app = express();
const port = 2000;

const itineraryController = require("./controller/itinerary");
const dayPlanController = require("./controller/dayPlan");
const locationController = require("./controller/location");
const diaryEntryController = require("./controller/diaryEntry");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World ");
});

app.use("/itinerary", itineraryController);
app.use("/dayPlan", dayPlanController);
app.use("/location", locationController);
app.use("/diaryEntry", diaryEntryController);

app.post("/itinerary/create", async (req, res) => {
  try {
    const itinerary = await create(req.body);
    res.json(itinerary); // Vrací objekt itineráře ve formátu JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Pokud nastane chyba, vrátí chybovou zprávu
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
