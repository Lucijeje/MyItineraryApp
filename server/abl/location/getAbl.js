const Ajv = require("ajv");
const ajv = new Ajv();
const locationDao = require("../../dao/location-dao.js");

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

    // read location by given id
    const location = locationDao.get(reqParams.id);
    if (!location) {
      res.status(404).json({
        code: "locationNotFound",
        note: `location ${reqParams.id} not found`,
      });
      return;
    }

    res.json(location);
  } catch (e) {
    res.status(500).json({ location: e.location });
  }
}

module.exports = GetAbl;
