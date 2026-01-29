const Ajv = require("ajv");
const ajv = new Ajv();

const locationDao = require("../../dao/location-dao.js");

const schema = {
  type: "object",
  properties: {
    dayPlanId: { type: "string" },
    name: { type: "string" },
    address: { type: "string" },
    mapPosition:{ type: "object" },

  },
  required: ["name","dayPlanId" ],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let location = req.body;
console.log(req)
    // validate input
    const valid = ajv.validate(schema, location);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        note: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

   // location.date = new Date().toISOString();

    location = locationDao.create(location);
    res.json(location);
  } catch (e) {
    res.status(500).json({ location: e.location });
  }
}

module.exports = CreateAbl;