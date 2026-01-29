import { useEffect, useState } from "react";
import { locationContext } from "./LocationContext.js";


function LocationProvider({ children }) {
  const [locationLoadObject, setLocationLoadObject] = useState({
    state: "ready",
    error: null,
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:2000/location/list");
        const data = await response.json();
        setLocationLoadObject({ state: "ready", data: data });
        console.log(data)
      } catch (error) {
        console.log("Chyba při načítání dat z API:", error);
        setLocationLoadObject({ state: "error", error: error, data: [] });
      }
    };

    fetchData();
  }, []); // Načte seznam itinerářů pouze při prvním načtení

  async function locationCreate(dtoIn) {
    console.log(dtoIn)
    setLocationLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:2000/location/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();
    console.log(responseJson)

    if (response.status < 400) {
      setLocationLoadObject((current) => {
        current.data.push(responseJson);
        current.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setLocationLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function locationUpdate(dtoIn) {
    setLocationLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:2000/location/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setLocationLoadObject((current) => {
        const locationIndex = current.data.findIndex(
          (e) => e.id === responseJson.id
        );
        current.data[locationIndex] = responseJson;
        current.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setLocationLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson,
      }));
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function locationDelete(dtoIn) {
    console.log(dtoIn);
    setLocationLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:2000/location/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();
    console.log(responseJson);
  
    if (response.status < 400) {
      setLocationLoadObject((current) => {
        const newData = current.data.filter((item) => item.id !== dtoIn.id); // Odstranění smazaného objektu ze stavu
        return { state: "ready", data: newData };
      });
      return responseJson;
    } else {
      setLocationLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  const value = {
    state: locationLoadObject.state,
    locationList: locationLoadObject.data || [],
    handlerMap: { locationCreate,locationUpdate, locationDelete },
  };


  return (
    <locationContext.Provider value={value}>
      {children}
    </locationContext.Provider>
  );
}



export default LocationProvider;