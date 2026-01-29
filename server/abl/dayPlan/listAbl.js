const dayPlanDao = require("../../dao/dayPlan-dao.js");

async function ListAbl(req, res) {
  try {
    const dayPlanList = dayPlanDao.list();
    res.json(dayPlanList);
  } catch (e) {
    res.status(500).json({ dayPlan: e.dayPlan });
  }
}

module.exports = ListAbl;