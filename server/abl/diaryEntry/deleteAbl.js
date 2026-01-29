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

async function DeleteAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.body;

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

    diaryEntryDao.remove(reqParams.id);
    res.json({});
  } catch (e) {
    res.status(500).json({ diaryEntry: e.diaryEntry });
  }
}

module.exports = DeleteAbl;
