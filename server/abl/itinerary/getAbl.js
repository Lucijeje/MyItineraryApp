const Ajv = require("ajv");
const ajv = new Ajv();
const itineraryDao = require("../../dao/itinerary-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        note: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read itinerary by given id
    const itinerary = itineraryDao.get(reqParams.id);
    if (!itinerary) {
      res.status(404).json({
        code: "itineraryNotFound",
        note: `itinerary ${reqParams.id} not found`,
      });
      return;
    }

    res.json(itinerary);
  } catch (e) {
    res.status(500).json({ itinerary: e.itinerary });
  }
}

module.exports = GetAbl;
