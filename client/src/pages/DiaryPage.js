
import { itineraryContext } from "../components/Itinerary/ItineraryContext.js"; //importuji kontext kvůli itinerary/delete funkci
import { useParams } from 'react-router-dom';
import { useState, useContext } from 'react';
import { diaryEntryContext } from "../components/DiaryEntry/DiaryEntryContext"; //importuji context pro
import DiaryEntryList from '../components/DiaryEntry/DiaryEntryList.js';
import "./DiaryPage.css"

function DiaryPage() {
  const { itineraryList } = useContext(itineraryContext); // z contextu nahrávám funkci itinerary/delete
  const { diaryEntryList } = useContext(diaryEntryContext); // contextem listuji všechny itineráře, které mám na serveru
  let { itineraryId } = useParams();

  const itineraryData = itineraryList.find((inv) => inv.id === itineraryId);
  if (!itineraryData) {
    return <div className="loading-state">Loading itinerary data...</div>;
  }

  const diaryEntryData = diaryEntryList.filter((inv) => inv.itineraryId === itineraryId);
  if (!diaryEntryData) {
    return <div className="loading-state">Loading diary data...</div>;
  }
  console.log(diaryEntryData)



  return (
    <div className='diaryContainer'>
      <div className='diaryContainerHeader'>
      <h1>Itinerary Diary</h1>
      <p>Welcome to the Diary of Itinerary page! Here, you will find detailed information about 
        the itinerary to which these diary entries belong. This section serves as a centralized 
        spot for reviewing and managing your diary entries associated with this specific itinerary. </p>
    </div>
    <div className='diaryContainerOverview'>
      <div className='itineraryInfoHeader'>
        <h3>{itineraryData.name}</h3>
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
  <div className='diaryContainerList'>
  <h2>Diary Entries</h2>
  <p>Below, you can browse through the list of diary entries made during the trip. 
    Each entry captures unique experiences, thoughts, 
    and occurrences on specific days of the itinerary.
    Feel free to edit or delete each of the diary entry.</p>
 <DiaryEntryList data= {diaryEntryData}></DiaryEntryList>
 </div>
 </div>
  );
}

export default DiaryPage;