import { useEffect, useState } from "react";
import { diaryEntryContext } from "./DiaryEntryContext.js";


function DiaryEntryProvider({ children }) {
  const [diaryEntryLoadObject, setDiaryEntryLoadObject] = useState({
    state: "ready",
    error: null,
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:2000/diaryEntry/list");
        const data = await response.json();
        setDiaryEntryLoadObject({ state: "ready", data: data });
        console.log(data)
      } catch (error) {
        console.log("Chyba při načítání dat z API:", error);
        setDiaryEntryLoadObject({ state: "error", error: error, data: [] });
      }
    };

    fetchData();
  }, []); // Načte seznam itinerářů pouze při prvním načtení

  async function diaryEntryCreate(dtoIn) {
    console.log(dtoIn)
    setDiaryEntryLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:2000/diaryEntry/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();
    console.log(responseJson)

    if (response.status < 400) {
      setDiaryEntryLoadObject((current) => {
        current.data.push(responseJson);
        current.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setDiaryEntryLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function diaryEntryUpdate(dtoIn) {
    setDiaryEntryLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:2000/diaryEntry/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();

    if (response.status < 400) {
      setDiaryEntryLoadObject((current) => {
        const diaryEntryIndex = current.data.findIndex(
          (e) => e.id === responseJson.id
        );
        current.data[diaryEntryIndex] = responseJson;
        current.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { state: "ready", data: current.data };
      });
      return responseJson;
    } else {
      setDiaryEntryLoadObject((current) => ({
        state: "error",
        data: current.data,
        error: responseJson,
      }));
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  async function diaryEntryDelete(dtoIn) {
    console.log(dtoIn);
    setDiaryEntryLoadObject((current) => ({ ...current, state: "pending" }));
    const response = await fetch(`http://localhost:2000/diaryEntry/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    const responseJson = await response.json();
    console.log(responseJson);
  
    if (response.status < 400) {
      setDiaryEntryLoadObject((current) => {
        const newData = current.data.filter((item) => item.id !== dtoIn.id); // Odstranění smazaného objektu ze stavu
        return { state: "ready", data: newData };
      });
      return responseJson;
    } else {
      setDiaryEntryLoadObject((current) => {
        return { state: "error", data: current.data, error: responseJson };
      });
      throw new Error(JSON.stringify(responseJson, null, 2));
    }
  }

  const value = {
    state: diaryEntryLoadObject.state,
    diaryEntryList: diaryEntryLoadObject.data || [],
    handlerMap: { diaryEntryCreate,diaryEntryUpdate, diaryEntryDelete },
  };


  return (
    <diaryEntryContext.Provider value={value}>
      {children}
    </diaryEntryContext.Provider>
  );
}



export default DiaryEntryProvider;