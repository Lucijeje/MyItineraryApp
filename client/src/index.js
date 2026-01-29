import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DiaryPage from "./pages/DiaryPage.js"
import Root from './pages/Root.js';
import ErrorPage from './pages/ErrorPage.js';
import HomePage from './pages/HomePage.js';
import ItineraryProvider from './components/Itinerary/ItineraryProvider.js';
import DayPlanProvider from './components/DayPlan/DayPlanProvider.js';
import LocationProvider from './components/Location/LocationProvider.js';
import DiaryEntryProvider from './components/DiaryEntry/DiaryEntryProvider.js';
import ItineraryPage from './pages/ItineraryPage.js';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/itinerary/:itineraryId',
        element: <ItineraryPage />,
        },
      {
      path: '/diary/:itineraryId',
      element: <DiaryPage />,
      }
    
    ]}], {
  basename: process.env.PUBLIC_URL || ''
});


/*createRoot(document.querySelector('#app')).render(
  <RouterProvider router={router} />
);*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DiaryEntryProvider>
    <DayPlanProvider>
    <LocationProvider>
      <ItineraryProvider>
     <RouterProvider router={router} />
     </ItineraryProvider>
     </LocationProvider>
     </DayPlanProvider>
     </DiaryEntryProvider> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
