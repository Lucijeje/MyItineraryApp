const itineraryDao = require("../../dao/itinerary-dao.js");

async function ListAbl(req, res) {
  try {
    const itineraryList = itineraryDao.list();
    res.json(itineraryList);
  } catch (e) {
    res.status(500).json({ itinerary: e.itinerary });
  }
}

module.exports = ListAbl;