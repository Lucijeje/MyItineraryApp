const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const diaryEntryFolderPath = path.join(__dirname, "storage", "diaryEntryList");
const dayPlanFolderPath = path.join(__dirname, "storage", "dayPlanList");
const dayPlanDao = require('./dayPlan-dao.js');
const itineraryDao = require('./itinerary-dao.js');


// Method to create an diaryEntry 
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


function create(diaryEntry) {
  console.log(diaryEntry)

 const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    try {
     diaryEntry.id = crypto.randomBytes(16).toString("hex");

     if  (!diaryEntry.text){
      diaryEntry.text = ""
     }

 
     const date = new Date(diaryEntry.date);
     diaryEntry.date = diaryEntry.date
    
  
     diaryEntry.dayOfWeek = diaryEntry.dayOfWeek
      const filePath = path.join(diaryEntryFolderPath, `${diaryEntry.id}.json`);
      const fileData = JSON.stringify(diaryEntry);
      fs.writeFileSync(filePath, fileData, "utf8");


   const updateDayPlan = {
    id: diaryEntry.dayPlanId,
    diaryEntryId: diaryEntry.id
   } 

   const updateItinerary = {
    id: diaryEntry.itineraryId,
    diaryEntryIdList: [diaryEntry.id]
   } 


   dayPlanDao.update(updateDayPlan);
   itineraryDao.addDiaryEntry(updateItinerary);

   delete diaryEntry.dayPlanId;
   delete diaryEntry.itineraryId;


      return diaryEntry;
    } catch (error) {
      throw { code: "failedToCreatediaryEntry", diaryEntry: error.diaryEntry };
    }
  }

  // Method to read an diaryEntry from a file
function get(diaryEntryId) {
  try {
    const filePath = path.join(diaryEntryFolderPath, `${diaryEntryId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReaddiaryEntry", diaryEntry: error.diaryEntry };
  }
}

function list() {
  try {
    const files = fs.readdirSync(diaryEntryFolderPath);
    const diaryEntryList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(diaryEntryFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return diaryEntryList;
  } catch (error) {
    throw { code: "failedToListdiaryEntrys", diaryEntry: error.diaryEntry };
  }
}

async function remove(diaryEntryId) {
  try {
  
    const itineraries = itineraryDao.list();
    const dayPlans = dayPlanDao.list();


    itineraries.forEach(itinerary => {
      itinerary.diaryEntryIdList = itinerary.diaryEntryIdList.filter(id => id !== diaryEntryId);
      itineraryDao.update(itinerary);
    });

    dayPlans.forEach(dayPlan => {
      if (dayPlan.diaryEntryId === diaryEntryId) {
        dayPlan.diaryEntryId = " "; 
        dayPlanDao.update(dayPlan);
      }
    });

   
    const filePath = path.join(diaryEntryFolderPath, `${diaryEntryId}.json`);
    fs.unlinkSync(filePath);

    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemovediaryEntry", diaryEntry: error.diaryEntry };
  }
}

function update(diaryEntry) {
 
  try {
    const currentdiaryEntry = get(diaryEntry.id);
    if (!currentdiaryEntry) return null;
    const newdiaryEntry = { ...currentdiaryEntry, ...diaryEntry };
    const filePath = path.join(diaryEntryFolderPath, `${diaryEntry.id}.json`);
    const fileData = JSON.stringify(newdiaryEntry);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newdiaryEntry;
  } catch (error) {
    throw { code: "failedToUpdatediaryEntry", diaryEntry: error.diaryEntry };
  }
}
  

  module.exports = {
    create,
    list,
    remove,
    update,
    get
  };
  