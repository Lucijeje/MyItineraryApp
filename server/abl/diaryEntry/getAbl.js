const Ajv = require("ajv");
const ajv = new Ajv();
const diaryEntryDao = require("../../dao/diaryEntry-dao.js");

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

    // read diaryEntry by given id
    const diaryEntry = diaryEntryDao.get(reqParams.id);
    if (!diaryEntry) {
      res.status(404).json({
        code: "diaryEntryNotFound",
        note: `diaryEntry ${reqParams.id} not found`,
      });
      return;
    }

    res.json(diaryEntry);
  } catch (e) {
    res.status(500).json({ diaryEntry: e.diaryEntry });
  }
}

module.exports = GetAbl;
