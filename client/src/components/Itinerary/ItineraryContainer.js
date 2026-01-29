import React, { useState } from 'react';
import CreateItineraryButton from './ItineraryButton';
import CreateItineraryForm from './ItineraryForm';
import { useContext} from "react";
import { itineraryContext } from "./ItineraryContext";

const CreateItineraryContainer = ({ defaultValues }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Stav pro sledování, zda je itinerář upravován

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => {
    setShowModal(true);
    setIsEditing(true); // Nastavení isEditing na true při otevření modálního okna
  };
  const { state, handlerMap } = useContext(itineraryContext);
 

  return (
    <>
       <CreateItineraryButton onClick={() => {
        handleShowModal();
        setIsEditing(false); // Při vytváření nového itineráře nejsme v režimu úprav
      }} />
      {isEditing ? (
        <CreateItineraryForm
          show={showModal}
          handleClose={handleCloseModal}
      //    onSubmit={handleCreateItinerary}
          defaultValues={defaultValues}
          isUpdating={true} // Nastavíme tento atribut na true pro aktualizaci itineráře
        />
      ) : (
        <CreateItineraryForm
          show={showModal}
          handleClose={handleCloseModal}
     //     onSubmit={handleCreateItinerary}
          defaultValues={defaultValues}
        />
      )}
    </>
  );
};

export default CreateItineraryContainer;