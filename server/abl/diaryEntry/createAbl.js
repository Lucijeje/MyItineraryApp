const Ajv = require("ajv");
const ajv = new Ajv();

const validateDateTime = require("../../helper/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const diaryEntryDao = require("../../dao/diaryEntry-dao.js");

const schema = {
  type: "object",
  properties: {
    itineraryId: { type: "string" },
    dayPlanId: { type: "string" },
    name: { type: "string" },
    date: { type: "string" },
    text: { type: "string" }

  },
  required: ["dayPlanId", "itineraryId"],
  additionalProperties: true,
};

async function CreateAbl(req, res) {
  try {
    let diaryEntry = req.body;
    const valid = ajv.validate(schema, diaryEntry);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        note: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

   // diaryEntry.date = new Date().toISOString();

    diaryEntry = diaryEntryDao.create(diaryEntry);
    res.json(diaryEntry);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;