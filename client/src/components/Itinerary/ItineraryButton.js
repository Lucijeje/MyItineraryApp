import React from 'react';
import { Button } from 'react-bootstrap';
import './ItineraryButton.css';

const CreateItineraryButton = ({ onClick }) => {
  return (
    <Button
      variant="light"
      className="create-itinerary-btn"
      onClick={onClick}
    >
      <span className="create-itinerary-icon">+</span>
      <span>Create itinerary</span>
    </Button>
  );
};

export default CreateItineraryButton;
