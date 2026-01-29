const Ajv = require("ajv");
const ajv = new Ajv();
//const validateDateTime = require("../../helpers/validate-date-time.js");
//ajv.addFormat("date-time", { validate: validateDateTime });

const locationDao = require("../../dao/location-dao.js");

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
    let location = req.body;

   /* // validate input
    const valid = ajv.validate(schema, location);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        note: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }*/

    const updatedlocation = locationDao.update(location);

    if (!updatedlocation) {
      res.status(404).json({
        code: "locationNotFound",
        note: `location ${location.id} not found`,
      });
      return;
    }

    res.json(updatedlocation);
  } catch (e) {
    res.status(500).json({ location: e.location });
  }
}

module.exports = UpdateAbl;