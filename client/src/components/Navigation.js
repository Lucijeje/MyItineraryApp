
import { itineraryContext } from "./Itinerary/ItineraryContext";
import { useContext, useState } from "react";
import { diaryEntryContext } from './DiaryEntry/DiaryEntryContext';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const { error, itineraryList, state } = useContext(itineraryContext);
  const { diaryEntryList } = useContext(diaryEntryContext);
  const [openItineraries, setOpenItineraries] = useState(true);
  const [openDiary, setOpenDiary] = useState(true);

  // Helper function to parse DD.MM.YYYY date format
  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);
    const parts = dateString.split('.');
    if (parts.length !== 3) return new Date(0);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  // Sort itineraries by startDate (nearest first)
  const sortedItineraryList = [...itineraryList].sort((a, b) => {
    const dateA = parseDate(a.startDate);
    const dateB = parseDate(b.startDate);
    return dateA - dateB;
  });

  // Filtrujeme itineráře, které mají neprázdné pole diaryEntryIdList
  // Přidáváme kontrolu, zda diaryEntryIdList existuje a není undefined
  const itinerariesWithDiary = sortedItineraryList
    .filter(itinerary => itinerary.diaryEntryIdList && itinerary.diaryEntryIdList.length > 0)
    .sort((a, b) => {
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      return dateA - dateB;
    });
  console.log(itinerariesWithDiary);

  return (
    <div className="sidebar-nav">
      <div className="nav-section">
        <button
          type="button"
          className={`nav-section-header ${openItineraries ? "open" : ""}`}
          onClick={() => setOpenItineraries((prev) => !prev)}
        >
          <span>Itineraries</span>
          <span className={`nav-section-chevron ${openItineraries ? "open" : ""}`}>
            ▾
          </span>
        </button>
        {openItineraries && (
          <div className="nav-section-list">
            {sortedItineraryList.length > 0 ? (
              sortedItineraryList.map((itinerary) => {
                const hasName = itinerary.name && itinerary.name.trim() !== "";
                const hasDates = itinerary.startDate && itinerary.endDate;

                // Pokud by se v datech objevil úplně prázdný itinerář, v navigaci ho neschováme
                if (!hasName && !hasDates) return null;

                return (
                  <Link
                    key={itinerary.id}
                    to={`/itinerary/${itinerary.id}`}
                    className="nav-section-item"
                  >
                    <span className="nav-section-item-title">
                      {hasName ? itinerary.name : "Untitled itinerary"}
                    </span>
                    {hasDates && (
                      <span className="nav-section-item-subtitle">
                        {itinerary.startDate} - {itinerary.endDate}
                      </span>
                    )}
                  </Link>
                );
              })
            ) : (
              <div className="nav-section-empty">No itineraries yet.</div>
            )}
          </div>
        )}
      </div>

      <div className="nav-section">
        <button
          type="button"
          className={`nav-section-header ${openDiary ? "open" : ""}`}
          onClick={() => setOpenDiary((prev) => !prev)}
        >
          <span>Diary</span>
          <span className={`nav-section-chevron ${openDiary ? "open" : ""}`}>
            ▾
          </span>
        </button>
        {openDiary && (
          <div className="nav-section-list">
            {itinerariesWithDiary.length > 0 ? (
              itinerariesWithDiary.map((itinerary) => {
                const hasName = itinerary.name && itinerary.name.trim() !== "";
                const hasDates = itinerary.startDate && itinerary.endDate;

                if (!hasName && !hasDates) return null;

                return (
                  <Link
                    key={itinerary.id}
                    to={`/diary/${itinerary.id}`}
                    className="nav-section-item"
                  >
                    <span className="nav-section-item-title">
                      {hasName ? itinerary.name : "Untitled itinerary"}
                    </span>
                    {hasDates && (
                      <span className="nav-section-item-subtitle">
                        {itinerary.startDate} - {itinerary.endDate}
                      </span>
                    )}
                  </Link>
                );
              })
            ) : (
              <div className="nav-section-empty">No diary entries yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
