const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dayPlanFolderPath = path.join(__dirname, "storage", "dayPlanList");



// Method to create an dayPlan 
function create(dayPlan) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    try {
     dayPlan.id = crypto.randomBytes(16).toString("hex");
     dayPlan.locationIdList =  [];
     dayPlan.diaryEntry = [];

     // Převést řetězec na objekt Date
     const date = new Date(dayPlan.date);
    
     // Získat den v týdnu
     const dayIndex = date.getDay();
     dayPlan.dayOfWeek = daysOfWeek[dayIndex];

      const filePath = path.join(dayPlanFolderPath, `${dayPlan.id}.json`);
      const fileData = JSON.stringify(dayPlan);
      fs.writeFileSync(filePath, fileData, "utf8");
      console.log(dayPlan)
      return dayPlan;
    } catch (error) {
      throw { code: "failedToCreatedayPlan", dayPlan: error.dayPlan };
    }
  }

  function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('.');
}


// Converts ISO date string to Date object directly without parsing European format
function parseISODate(isoString) {
  return new Date(isoString);
}

// Method to create an dayPlan
async function createFromItinerary(dayPlanDate) {
  console.log(dayPlanDate)
  console.log("Received date:", dayPlanDate);
  const convertedDate = parseISODate(dayPlanDate); // Convert ISO date string directly
  console.log("Converted date:", convertedDate);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  try {
    const id = crypto.randomBytes(16).toString("hex");
    const dayPlan = {
      id: id,
      description: "",
      dayOfWeek: daysOfWeek[convertedDate.getDay()],
      accomodation: "",
      locationIdList: [],
      diaryEntryId: [],
      date: convertedDate.toISOString() // Keep date in ISO format for consistency
    };

    const filePath = path.join(dayPlanFolderPath, `${id}.json`);
    const fileData = JSON.stringify(dayPlan);
    await fs.promises.writeFile(filePath, fileData, "utf8");
    console.log("Day plan created:", dayPlan);
    return dayPlan;
  } catch (error) {
    console.error("Failed to create day plan:", error);
    throw { code: "failedToCreateDayPlan", error: error };
  }
}



    // Method to read an dayPlan from a file
function get(dayPlanId) {
    try {
      const filePath = path.join(dayPlanFolderPath, `${dayPlanId}.json`);
      const fileData = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileData);
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw { code: "failedToReaddayPlan", dayPlan: error.dayPlan };
    }
  }

  function list() {
    try {
      const files = fs.readdirSync(dayPlanFolderPath);
      const dayPlanList = files.map((file) => {
        const fileData = fs.readFileSync(path.join(dayPlanFolderPath, file), "utf8");
        return JSON.parse(fileData);
      });
      return dayPlanList;
    } catch (error) {
      throw { code: "failedToListdayPlans", dayPlan: error.dayPlan };
    }
  }
  
  function remove(dayPlanId) {
    try {
      const filePath = path.join(dayPlanFolderPath, `${dayPlanId}.json`);
      fs.unlinkSync(filePath);
      return {};
    } catch (error) {
      if (error.code === "ENOENT") {
        return {};
      }
      throw { code: "failedToRemovedayPlan", dayPlan: error.dayPlan };
    }
  }

  function update(dayPlan) {
    try {
      const currentdayPlan = get(dayPlan.id);
      if (!currentdayPlan) return null;
      const newdayPlan = { ...currentdayPlan, ...dayPlan };
      const filePath = path.join(dayPlanFolderPath, `${dayPlan.id}.json`);
      const fileData = JSON.stringify(newdayPlan);
      fs.writeFileSync(filePath, fileData, "utf8");
      return newdayPlan;
    } catch (error) {
      throw { code: "failedToUpdatedayPlan", dayPlan: error.dayPlan };
    }
  }

  async function addlocation(updateDayPlan) {
    console.log(updateDayPlan)

    try {
      // Načtení existujícího itineráře podle ID
      const dayPlan = await get(updateDayPlan.id);
      if (!dayPlan) {
          throw { code: "dayPlanyNotFound", message: "dayPlan not found." };
      }
  
      dayPlan.locationIdList = dayPlan.locationIdList.concat(updateDayPlan.locationId);
  
      // Aktualizace itineráře v úložišti

      const updatedDayPlan = await update(dayPlan);
  
  
  
      // Návrat aktualizovaného itineráře
      return updatedDayPlan;
    } catch (error) {
      throw { code: "failedToUpdateDayPlanWithlocation", message: error.message };
    }
  }

  
  module.exports = {
    create,
    addlocation,
    createFromItinerary,
    get,
    list,
    remove,
    update
  };
  