import { createContext } from "react";

export  const itineraryContext = createContext({
  error: null,
  data: [],
});
