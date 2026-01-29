const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");

const itineraryFolderPath = path.join(__dirname, "storage", "itineraryList");
const dayPlanFolderPath = path.join(__dirname, "storage", "dayPlanList");
const dayPlanDao = require('./dayPlan-dao.js'); // import dao metod dayplanu

// Function to format dates as "dd.mm.yyyy"
function formatDate(date) {
  const d = new Date(date);
  const day = ('0' + d.getDate()).slice(-2);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

// Function to parse dates in the format "dd.mm.yyyy"
function parseEuropeanDate(dateString) {
  const parts = dateString.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are zero-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  } else {
    throw new Error("Invalid date format");
  }
}


// Method to create an itinerary 
async function create(itinerary) {
  try {
    itinerary.id = crypto.randomBytes(16).toString("hex");
    itinerary.description = itinerary.description || "";
    itinerary.destination = itinerary.destination || "";

    const startDate = new Date(itinerary.startDate);
    const endDate = new Date(itinerary.endDate);
    itinerary.startDate = formatDate(startDate);
    itinerary.endDate = formatDate(endDate);

    // Calculate the number of days
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    itinerary.numDays = Math.ceil(differenceInDays + 1);

    const dayPlanIdList = await createDayPlansFromItinerary(itinerary);
    itinerary.dayPlanIdList = dayPlanIdList;
    itinerary.diaryEntryIdList = []

    const filePath = path.join(itineraryFolderPath, `${itinerary.id}.json`);
    const fileData = JSON.stringify(itinerary);
    fs.writeFileSync(filePath, fileData, "utf8");
    return itinerary;
  } catch (error) {
    throw { code: "failedToCreateItinerary", message: error.message };
  }
}

// Creates day plans from itinerary
async function createDayPlansFromItinerary(itinerary) {
  console.log("Itinerary:", itinerary);
  const startDate = parseEuropeanDate(itinerary.startDate);
  const endDate = parseEuropeanDate(itinerary.endDate);
  const numDays = itinerary.numDays;
  const dayPlanIdList = [];

  for (let i = 0; i < numDays; i++) {
    const dayPlanDate = new Date(startDate.getTime());
    dayPlanDate.setDate(dayPlanDate.getDate() + i);

    try {
      const dayPlan = await createDayPlan(dayPlanDate);
      dayPlanIdList.push(dayPlan.id);
    } catch (error) {
      console.error('Error creating dayPlan:', error);
    }
  }
  return dayPlanIdList;
}

async function createDayPlan(dayPlanDate) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const id = crypto.randomBytes(16).toString("hex");
  const dayPlan = {
    id: id,
    description: "",
    dayOfWeek: daysOfWeek[dayPlanDate.getDay()],
    accomodation: "",
    locationIdList: [],
    diaryEntryId: [],
    date: formatDate(dayPlanDate) // Keep date in "dd.mm.yyyy" format for consistency
  };

  const filePath = path.join(dayPlanFolderPath, `${id}.json`);
  const fileData = JSON.stringify(dayPlan);
  await fs.promises.writeFile(filePath, fileData, "utf8");
  console.log("Day plan created:", dayPlan);
  return dayPlan;
}

  // Method to read an itinerary from a file
function get(itineraryId) {
  try {
    const filePath = path.join(itineraryFolderPath, `${itineraryId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReaditinerary", itinerary: error.itinerary };
  }
}

function list() {
  try {
    console.log("itinerary-dao.list: Reading from folder:", itineraryFolderPath);
    const files = fs.readdirSync(itineraryFolderPath);
    console.log(`itinerary-dao.list: Found ${files.length} files`);
    const itineraryList = files.map((file) => {
      const filePath = path.join(itineraryFolderPath, file);
      const fileData = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileData);
    });
    console.log(`itinerary-dao.list: Returning ${itineraryList.length} itineraries`);
    return itineraryList;
  } catch (error) {
    console.error("itinerary-dao.list: Error:", error);
    throw { code: "failedToListItinerarys", itinerary: error.itinerary, message: error.message };
  }
}

function remove(itineraryId) {
  try {
    const filePath = path.join(itineraryFolderPath, `${itineraryId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveItinerary", itinerary: error.itinerary };
  }
}

function update(itinerary) {
  try {
    const currentItinerary = get(itinerary.id);
    if (!currentItinerary) return null;
    const newItinerary = { ...currentItinerary, ...itinerary };
    const filePath = path.join(itineraryFolderPath, `${itinerary.id}.json`);
    const fileData = JSON.stringify(newItinerary);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newItinerary;
  } catch (error) {
    throw { code: "failedToUpdateItinerary", itinerary: error.itinerary };
  }
}

function download(itinerary) {
  try {
      // Načtení itineráře z úložiště
      const itineraryFilePath = path.join(itineraryFolderPath, `${itinerary.id}.json`);
      const itineraryData = JSON.parse(fs.readFileSync(itineraryFilePath, "utf8"));

      if (!itineraryData) {
          throw { code: "itineraryNotFound", message: "Itinerary not found." };
      }

      // Vytvoření nového PDF dokumentu
      const pdfDoc = new PDFDocument();
      const pdfFilePath = path.join(__dirname, "downloads", `${itinerary.id}.pdf`);
      pdfDoc.pipe(fs.createWriteStream(pdfFilePath));

      // Zde můžete přidat logiku pro tvorbu obsahu PDF podle dat z itineráře
      pdfDoc.fontSize(20).text(`Itinerary ID: ${itinerary.id}`);
      // Přidání dalších informací z itineráře ...

      // Uzavření PDF dokumentu
      pdfDoc.end();

      // Návrat cesty k vygenerovanému PDF souboru
  } catch (error) {
      throw { code: "failedToDownloadItineraryPDF", message: error.message };
  }
}

async function addDiaryEntry(updateItinerary) {
  console.log(updateItinerary)

  try {
    // Načtení existujícího itineráře podle ID
    const itinerary = await get(updateItinerary.id);
    if (!itinerary) {
        throw { code: "itineraryNotFound", message: "Itinerary not found." };
    }
  
    itinerary.diaryEntryIdList = itinerary.diaryEntryIdList.concat(updateItinerary.diaryEntryIdList);

    // Aktualizace itineráře v úložišti

    const updatedItinerary = await update(itinerary);



    // Návrat aktualizovaného itineráře
    return updatedItinerary;
  } catch (error) {
    throw { code: "failedToUpdateItineraryWithDiaryEntryId", message: error.message };
  }
}
  

  module.exports = {
    create,
    addDiaryEntry,
    download,
    list,
    remove,
    update,
    get
  };
  