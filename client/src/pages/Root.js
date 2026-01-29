import React from "react";
import CreateItineraryContainer from "../components/Itinerary/ItineraryContainer.js";
import "./root.css";
import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import { itineraryContext } from "../components/Itinerary/ItineraryContext.js"; //importuji context pro itinerary
import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Logo from "../components/Logo.js";

export default function Root() {
  const { error, itineraryList, state } = useContext(itineraryContext);

  console.log(itineraryList)


  return (
    <>
      <div id="main-content">
        <div id="sidebar">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Logo />
          </Link>
          <CreateItineraryContainer/>
          <Navigation/>
        </div>
        <div id="detail">
          <Outlet />
        </div>
      </div>
      <Footer />
      </>
  );
}
