const Ajv = require("ajv");
const ajv = new Ajv();
//const validateDateTime = require("../../helpers/validate-date-time.js");
//ajv.addFormat("date-time", { validate: validateDateTime });

const dayPlanDao = require("../../dao/dayPlan-dao.js");

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
    let dayPlan = req.body;

   /* // validate input
    const valid = ajv.validate(schema, dayPlan);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        note: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }*/

    const updateddayPlan = dayPlanDao.update(dayPlan);

    if (!updateddayPlan) {
      res.status(404).json({
        code: "dayPlanNotFound",
        note: `dayPlan ${dayPlan.id} not found`,
      });
      return;
    }

    res.json(updateddayPlan);
  } catch (e) {
    res.status(500).json({ dayPlan: e.dayPlan });
  }
}

module.exports = UpdateAbl;