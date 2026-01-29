import { useEffect, useState } from "react";
import { itineraryContext } from "./ItineraryContext.js";
import API_BASE_URL from "../../config/api.js";


function ItineraryProvider({ children }) {
  const [itineraryLoadObject, setItineraryLoadObject] = useState({
    state: "ready",
    error: null,
    data: [],
  });

  // Helper function to parse DD.MM.YYYY date format
  const parseDate = (dateString) => {
    if (!dateString) return new Date(0); // Return epoch for invalid dates
    const parts = dateString.split('.');
    if (parts.length !== 3) return new Date(0);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  // Helper function to sort itineraries by startDate (nearest first)
  const sortItinerariesByDate = (itineraries) => {
    return [...itineraries].sort((a, b) => {
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      return dateA - dateB; // Ascending order (nearest first)
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/itinerary/list`);
        const data = await response.json();
        const sortedData = sortItinerariesByDate(data);
        setItineraryLoadObject({ state: "ready", data: sortedData });
      } catch (error) {
        console.log("Chyba při načítání dat z API:", error);
        setItineraryLoadObject({ state: "error", error: error, data: [] });
      }
    };

    fetchData();
  }, []); // Načte seznam itinerářů pouze při prvním načtení

  async function itineraryCreate(dtoIn) {
    console.log(dtoIn)
    setItineraryLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`${API_BASE_URL}/itinerary/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();
    console.log(responseJson)

    if (response.status < 400) {
      setItineraryLoadObject((current) => {
        // create new array so React reliably re-renders consumers (e.g. navigation)
        const newData = [...(current.data || []), responseJson];
        // sort by startDate so itineraries appear in correct order (nearest first)
        const sortedData = sortItinerariesByDate(newData);
        return { state: "ready", error: null, data: sortedData };
      });
      return responseJson;
    } else {
      setItineraryLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function itineraryUpdate(dtoIn) {
    setItineraryLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`${API_BASE_URL}/itinerary/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setItineraryLoadObject((current) => {
        const existing = current.data || [];
        const itineraryIndex = existing.findIndex((e) => e.id === responseJson.id);
        const newData = [...existing];
        if (itineraryIndex !== -1) {
          newData[itineraryIndex] = responseJson;
        } else {
          newData.push(responseJson);
        }
        const sortedData = sortItinerariesByDate(newData);
        return { state: "ready", error: null, data: sortedData };
      });
      return responseJson;
    } else {
      setItineraryLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson,
      }));
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function itineraryDelete(dtoIn) {
    console.log(dtoIn);
    setItineraryLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`${API_BASE_URL}/itinerary/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();
    console.log(responseJson);
  
    if (response.status < 400) {
      setItineraryLoadObject((current) => {
        const newData = current.data.filter((item) => item.id !== dtoIn.id); // Odstranění smazaného objektu ze stavu
        const sortedData = sortItinerariesByDate(newData);
        return { state: "ready", data: sortedData };
      });
      return responseJson;
    } else {
      setItineraryLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  const value = {
    state: itineraryLoadObject.state,
    itineraryList: itineraryLoadObject.data || [],
    handlerMap: { itineraryCreate,itineraryUpdate, itineraryDelete },
  };


  return (
    <itineraryContext.Provider value={value}>
      {children}
    </itineraryContext.Provider>
  );
}



export default ItineraryProvider;