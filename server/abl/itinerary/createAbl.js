const Ajv = require("ajv");
const ajv = new Ajv();

const validateDateTime = require("../../helper/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const itineraryDao = require("../../dao/itinerary-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    destination: { type: "string" },
    description: { type: "string" },
    startDate: { type: "string", format: "date-time"},
    endDate: { type: "string", format: "date-time"}
  },
  required: ["name", "startDate", "endDate"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let itinerary = req.body;

    // validate input
    const valid = ajv.validate(schema, itinerary);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        note: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }


    itinerary = itineraryDao.create(itinerary);
    res.json(itinerary);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;