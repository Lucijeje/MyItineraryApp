const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helper/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const dayPlanDao = require("../../dao/dayPlan-dao.js");

const schema = {
  type: "object",
  properties: {
    date: { type: "string", format: "date-time" },
    description: { type: "string" },
    accomodation: { type: "string" }
  },
  required: ["date"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let dayPlan = req.body;

    // validate input
    const valid = ajv.validate(schema, dayPlan);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    dayPlan = dayPlanDao.create(dayPlan);
    res.json(dayPlan);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;