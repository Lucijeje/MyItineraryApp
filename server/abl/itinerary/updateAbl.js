const Ajv = require("ajv");
const ajv = new Ajv();
//const validateDateTime = require("../../helpers/validate-date-time.js");
//ajv.addFormat("date-time", { validate: validateDateTime });

const itineraryDao = require("../../dao/itinerary-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    destination: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let itinerary = req.body;


    const updatedItinerary = itineraryDao.update(itinerary);

    if (!updatedItinerary) {
      res.status(404).json({
        code: "itineraryNotFound",
        note: `Itinerary ${itinerary.id} not found`,
      });
      return;
    }

    res.json(updatedItinerary);
  } catch (e) {
    res.status(500).json({ itinerary: e.itinerary });
  }
}

module.exports = UpdateAbl;