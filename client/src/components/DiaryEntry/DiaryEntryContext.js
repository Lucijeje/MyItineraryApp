import { createContext } from "react";

export  const diaryEntryContext = createContext({
  error: null,
  data: [],
});
