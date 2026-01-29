const Ajv = require("ajv");
const ajv = new Ajv();

const validateDateTime = require("../../helper/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const itineraryDao = require("../../dao/itinerary-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" }

  },
  required: ["id"],
  additionalProperties: false,
};

async function downloadAbl(req, res) {
  try {
    let itinerary = req.body;
    const valid = ajv.validate(schema, itinerary);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        note: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

   // itinerary.date = new Date().toISOString();

    itinerary = itineraryDao.download(itinerary);
    res.json(itinerary);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = downloadAbl;