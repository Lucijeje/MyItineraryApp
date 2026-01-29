const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const locationFolderPath = path.join(__dirname, "storage", "locationList");
const dayPlanDao = require('./dayPlan-dao.js'); // import dao metod dayplanu


// Method to create an location 
function create(location) {
    try {
     location.id = crypto.randomBytes(16).toString("hex");
      const filePath = path.join(locationFolderPath, `${location.id}.json`);
      const fileData = JSON.stringify(location);

      const updateDayPlan = {
        id: location.dayPlanId,
        locationId:[ location.id]
       } 

       dayPlanDao.addlocation(updateDayPlan);

      fs.writeFileSync(filePath, fileData, "utf8");
      return location;
    } catch (error) {
      throw { code: "failedToCreatelocation", location: error.location };
    }
  }

  // Method to read an location from a file
function get(locationId) {
  try {
    const filePath = path.join(locationFolderPath, `${locationId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadlocation", location: error.location };
  }
}

function list() {
  try {
    const files = fs.readdirSync(locationFolderPath);
    const locationList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(locationFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return locationList;
  } catch (error) {
    throw { code: "failedToListlocations", location: error.location };
  }
}

async function remove(locationId) {
  try {

    const dayPlans = dayPlanDao.list();

 
    dayPlans.forEach(dayPlan => {
   
      if (dayPlan.locationIdList.includes(locationId)) {

        dayPlan.locationIdList = dayPlan.locationIdList.filter(id => id !== locationId);
    
        dayPlanDao.update(dayPlan);
      }
    });

   
    const filePath = path.join(locationFolderPath, `${locationId}.json`);
    fs.unlinkSync(filePath);

    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemovelocation", location: error.location };
  }
}
function update(location) {
  try {
    const currentlocation = get(location.id);
    if (!currentlocation) return null;
    const newlocation = { ...currentlocation, ...location };
    const filePath = path.join(locationFolderPath, `${location.id}.json`);
    const fileData = JSON.stringify(newlocation);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newlocation;
  } catch (error) {
    throw { code: "failedToUpdatelocation", location: error.location };
  }
}
  

  module.exports = {
    create,
    list,
    remove,
    update,
    get
  };
  