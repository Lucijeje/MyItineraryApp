const locationDao = require("../../dao/location-dao.js");

async function ListAbl(req, res) {
  try {
    const locationList = locationDao.list();
    res.json(locationList);
  } catch (e) {
    res.status(500).json({ location: e.location });
  }
}

module.exports = ListAbl;