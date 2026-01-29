import { useEffect, useState } from "react";
import { dayPlanContext } from "./DayPlanContext.js";
import API_BASE_URL from "../../config/api.js";


function DayPlanProvider({ children }) {
  const [dayPlanLoadObject, setDayPlanLoadObject] = useState({
    state: "ready",
    error: null,
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dayPlan/list`);
        const data = await response.json();
        setDayPlanLoadObject({ state: "ready", data: data });
        console.log(data)
      } catch (error) {
        console.log("Chyba při načítání dat z API:", error);
        setDayPlanLoadObject({ state: "error", error: error, data: [] });
      }
    };

    fetchData();
  }, []); // Načte seznam itinerářů pouze při prvním načtení

  async function dayPlanCreate(dtoIn) {
    console.log(dtoIn)
    setDayPlanLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`${API_BASE_URL}/dayPlan/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();
    console.log(responseJson)

    if (response.status < 400) {
      setDayPlanLoadObject((current) => {
        current.data.push(responseJson);
        current.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setDayPlanLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function dayPlanUpdate(dtoIn) {
    setDayPlanLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`${API_BASE_URL}/dayPlan/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setDayPlanLoadObject((current) => {
        const dayPlanIndex = current.data.findIndex(
          (e) => e.id === responseJson.id
        );
        current.data[dayPlanIndex] = responseJson;
        current.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setDayPlanLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson,
      }));
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function dayPlanDelete(dtoIn) {
    console.log(dtoIn);
    setDayPlanLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`${API_BASE_URL}/dayPlan/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();
    console.log(responseJson);
  
    if (response.status < 400) {
      setDayPlanLoadObject((current) => {
        const newData = current.data.filter((item) => item.id !== dtoIn.id); // Odstranění smazaného objektu ze stavu
        return { state: "ready", data: newData };
      });
      return responseJson;
    } else {
      setDayPlanLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  const value = {
    state: dayPlanLoadObject.state,
    dayPlanList: dayPlanLoadObject.data || [],
    handlerMap: { dayPlanCreate,dayPlanUpdate, dayPlanDelete },
  };


  return (
    <dayPlanContext.Provider value={value}>
      {children}
    </dayPlanContext.Provider>
  );
}



export default DayPlanProvider;