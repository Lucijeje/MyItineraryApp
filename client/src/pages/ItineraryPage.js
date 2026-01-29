
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { useState, useContext } from 'react';
import CreateItineraryForm from '../components/Itinerary/ItineraryForm';
import DeleteModal from '../components/DeleteModal';
import { itineraryContext } from "../components/Itinerary/ItineraryContext"; //importuji kontext kvůli itinerary/delete funkci
import DayPlanList from '../components/DayPlan/DayPlanList';
import "./ItineraryPage.css"



const ItineraryPage = () => {// do komponenty posílám prosps s itineraryList

  const { error, itineraryList, state, handlerMap } = useContext(itineraryContext); // z contextu nahrávám funkci itinerary/delete

  const [showUpdateModal, setShowUpdateModal] = useState(false); // Stav pro sledování zobrazení modálního okna pro update, posílám dál do createFormu

  ///potřebuji tohle?
  const [isUpdating, setIsUpdating] = useState(false); // Stav pro sledování aktualizace itineráře
  
  // Check localStorage for dismissed info cards
  const [showItineraryOverviewInfo, setShowItineraryOverviewInfo] = useState(() => {
    return localStorage.getItem('itineraryOverviewInfoDismissed') !== 'true';
  });
  
  const [showDayPlansInfo, setShowDayPlansInfo] = useState(() => {
    return localStorage.getItem('dayPlansInfoDismissed') !== 'true';
  });
  
  let { itineraryId } = useParams();
  
  // Show loading state while data is being fetched
  if (state === "pending") {
    return <div className="loading-state"><h3>Loading...</h3><p>Please wait while we load your itinerary data.</p></div>;
  }
  
  // Show error state if there's an error
  if (error) {
    return <div className="error-state"><h3>Error</h3><p>Failed to load itinerary data. Please try refreshing the page.</p></div>;
  }
  
  const itineraryData = itineraryList.find((inv) => inv.id === itineraryId);
  console.log(itineraryData)
 
  if (!itineraryData) {
    return <div className="error-state"><h3>Itinerary Not Found</h3><p>The requested itinerary could not be found.</p></div>; // Zobrazení zprávy, pokud data nejsou dostupná
  }
 
  // Funkce pro otevření modálního okna pro update
  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true); //nastavuje showupdate na true - informace pro update form
    setIsUpdating(true);  //nastavuje setIsUpdating na true - informace pro update form
  };

  // Funkce pro zavření modálního okna
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false); //nastavuje showUpdateModal na false - informace pro update form
    setIsUpdating(false); // nastavuje setIsUpdating na false - informace pro update form
  };

  const handleDelete = async () => { //funkce pro mazání itineráře, funguje díky contextu, posílám tam jen id itineráře

    await handlerMap.itineraryDelete({
    id:itineraryData.id
    });

    console.log(itineraryData)
  }

  const handleDismissItineraryOverview = () => {
    setShowItineraryOverviewInfo(false);
    localStorage.setItem('itineraryOverviewInfoDismissed', 'true');
  }

  const handleDismissDayPlans = () => {
    setShowDayPlansInfo(false);
    localStorage.setItem('dayPlansInfoDismissed', 'true');
  }   

    return (
     <div className='itineraryContainer'>
      <div className='itineraryContainerHeader'>
      <h1>Itinerary</h1>
      <p>Welcome to your Itinerary Details page! This page is your hub for all information related to your specific travel itinerary.
         Here, you can explore the structure of your trip,
         manage day plans, and seamlessly integrate your travel experiences by adding locations and diary entries.. </p>
    </div>
    {showItineraryOverviewInfo && (
      <div className='itineraryContainerOverview'>
        <button className='dismiss-button' onClick={handleDismissItineraryOverview} aria-label="Close">
          ×
        </button>
        <h2>Itinerary Overview</h2>
        <p>This section provides a comprehensive overview of your itinerary. It includes essential information such as the 
          start and end dates, destinations, and a brief description of the trip's purpose and highlights.
           Review the details to ensure that your travel plans are on track and aligned with your expectations.</p>
      </div>
    )}
    <div className='itineraryDataCard'>
      <div className='itineraryDataHeader'>
        <h3>{itineraryData.name}</h3>
        <div className='buttons'>
          <Button className='full-width-button' size='sm' variant="secondary"  onClick={handleOpenUpdateModal}>Update</Button>
          <DeleteModal item={"itinerary"} onDelete={handleDelete} 
            name={itineraryData.name} ></DeleteModal>
        </div>
      </div>
      <div className='itineraryInfoDetails'>
        <div className='infoItem'>
          <span className='infoIcon'>📍</span>
          <div className='infoContent'>
            <span className='infoLabel'>Destination</span>
            <span className='infoValue'>{itineraryData.destination}</span>
          </div>
        </div>
        <div className='infoItem'>
          <span className='infoIcon'>📅</span>
          <div className='infoContent'>
            <span className='infoLabel'>Dates</span>
            <span className='infoValue'>{itineraryData.startDate} - {itineraryData.endDate}</span>
          </div>
        </div>
        {itineraryData.description && (
          <div className='infoItem infoItemFull'>
            <span className='infoIcon'>📝</span>
            <div className='infoContent'>
              <span className='infoLabel'>Description</span>
              <span className='infoValue'>{itineraryData.description}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  {showDayPlansInfo && (
    <div className='diaryContainerList'>
      <button className='dismiss-button' onClick={handleDismissDayPlans} aria-label="Close">
        ×
      </button>
      <h2>Day Plans</h2>
      <p>Each day of your itinerary is organized into a day plan, which outlines the schedule for that particular day.
         Day plans are designed to help you manage your time efficiently while exploring new places.</p>
         <p> Add Locations to Day Plans: Enhance your day plans by adding locations you intend to visit. Each location can include details like address, opening hours, and a short note about what makes it worth visiting. 
          This feature helps you keep your travel itinerary organized and ensures you don't miss out on exciting places.</p>
         <p>Create a Diary Entry for Each Day Plan: Reflect on your daily adventures by creating a diary entry for each day plan. This is your personal space to jot down thoughts, experiences, and memories from the day. Whether it's a
           stunning sight you witnessed or a unique encounter, your diary entry will help you capture the essence of your travels.</p>
      </div>
    )}

          {showUpdateModal && (
          <CreateItineraryForm
            show={showUpdateModal}
            handleClose={handleCloseUpdateModal}
            isUpdating={isUpdating} // Předat správný stav isUpdating
            defaultValues={showUpdateModal ? {id: itineraryData.id, name:itineraryData.name, startDate:itineraryData.startDate, endDate: itineraryData.endDate, destination: itineraryData.destination, description: itineraryData.description} : {}} //hodnoty itineráře, který je na kartě
          />
        )}
      
      <DayPlanList itineraryId = {itineraryData.id} dayPlans={itineraryData.dayPlanIdList} />
      </div>
  );
};

export default ItineraryPage;