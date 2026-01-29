const itineraryDao = require("../../dao/itinerary-dao.js");

async function ListAbl(req, res) {
  try {
    console.log("ListAbl: Fetching itinerary list...");
    const itineraryList = itineraryDao.list();
    console.log(`ListAbl: Found ${itineraryList.length} itineraries`);
    res.json(itineraryList);
  } catch (e) {
    console.error("ListAbl: Error fetching itineraries:", e);
    res.status(500).json({ itinerary: e.itinerary, error: e.message });
  }
}

module.exports = ListAbl;