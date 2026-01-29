const Ajv = require("ajv");
const ajv = new Ajv();
//const validateDateTime = require("../../helpers/validate-date-time.js");
//ajv.addFormat("date-time", { validate: validateDateTime });

const diaryEntryDao = require("../../dao/diaryEntry-dao.js");

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
    let diaryEntry = req.body;

   /* // validate input
    const valid = ajv.validate(schema, diaryEntry);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        note: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }*/

    const updateddiaryEntry = diaryEntryDao.update(diaryEntry);

    if (!updateddiaryEntry) {
      res.status(404).json({
        code: "diaryEntryNotFound",
        note: `diaryEntry ${diaryEntry.id} not found`,
      });
      return;
    }

    res.json(updateddiaryEntry);
  } catch (e) {
    res.status(500).json({ diaryEntry: e.diaryEntry });
  }
}

module.exports = UpdateAbl;