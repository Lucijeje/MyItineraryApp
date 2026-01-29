const diaryEntryDao = require("../../dao/diaryEntry-dao.js");

async function ListAbl(req, res) {
  try {
    const diaryEntryList = diaryEntryDao.list();
    res.json(diaryEntryList);
  } catch (e) {
    res.status(500).json({ diaryEntry: e.diaryEntry });
  }
}

module.exports = ListAbl;