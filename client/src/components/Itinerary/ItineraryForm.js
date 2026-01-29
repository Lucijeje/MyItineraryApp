import React from 'react';

import { Form, Modal, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useState, useContext, useEffect, useCallback} from "react";
import { itineraryContext } from "./ItineraryContext"; //nahrání contextu itinerary
import AlertDisplay from '../AlertDisplay';


const CreateItineraryForm = ({ show, handleClose, defaultValues, isUpdating }) => {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  }); //použití useForm
  
  const { handlerMap } = useContext(itineraryContext);
  const [showAlert, setShowAlert] = useState(false);
  
  // Watch startDate to check if it's in the past
  const startDateValue = watch('startDate');

  // Check if start date is in the past
  const isStartDateInPast = () => {
    if (!startDateValue) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    const selectedDate = new Date(startDateValue);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  //funkce na změnu formáta data, aby prošlo do API
  const formatDateForAPI = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Předpokládám, že čas je pevně nastaven na 20:00
  };

  //funkce na převod DD.MM.YYYY na YYYY-MM-DD pro date input
  const formatDateForInput = useCallback((dateString) => {
    if (!dateString) return '';
    // Pokud už je ve formátu YYYY-MM-DD, vrať to
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    // Pokud je ve formátu DD.MM.YYYY, převeď to
    if (dateString.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
      const parts = dateString.split('.');
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    // Pokud je to Date objekt nebo ISO string, použij formatDateForAPI
    try {
      return formatDateForAPI(dateString);
    } catch (e) {
      return '';
    }
  }, []);

  //pokud se změní defaultValues formulář se aktualizuje s novými hodnotami
  useEffect(() => {
    if (defaultValues) {
      const formattedValues = {
        ...defaultValues,
        startDate: formatDateForInput(defaultValues.startDate),
        endDate: formatDateForInput(defaultValues.endDate),
      };
      reset(formattedValues);
    } else {
      reset({});
    }
  }, [defaultValues, reset, formatDateForInput]);
  
console.log(defaultValues)

  // Funkce pro zpracování formuláře
  const handleForm = async (formData) => {
    formData.startDate = formatDateForAPI(formData.startDate);
    formData.endDate = formatDateForAPI(formData.endDate);
    
    
    try {
      if (defaultValues && defaultValues.id) {
        await handlerMap.itineraryUpdate({
          ...formData,
          id: defaultValues.id,
        });
      } else {
        await handlerMap.itineraryCreate(formData);
      }
      
      handleClose(); // Uzavření modálního okna po úspěšném odeslání formuláře
      setShowAlert(true); //zobrazení Alertu o úspěšném vytvoření itineráře
    } catch (error) {
      console.error('Error handling form:', error);
    }
  };


  return (
    <>
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit= {handleSubmit(handleForm)}>
        <Modal.Header closeButton>
        <Modal.Title>{isUpdating ? 'Update' : 'Create'} Itinerary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>
              Name of Itinerary <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              defaultValue={defaultValues ? defaultValues.name : ''}
              {...register('name', {
                required: 'Name of itinerary is required.',
              })}
              isInvalid={!!errors.name}
            />
            {errors.name && (
              <Form.Text className="text-danger">{errors.name.message}</Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              defaultValue={defaultValues ? defaultValues.description : ''}
              {...register('description')}
            />
          </Form.Group>
          <Form.Group controlId="startDate" className="mb-3">
            <Form.Label>
              Start Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              defaultValue={defaultValues ? formatDateForInput(defaultValues.startDate) : ''}
              {...register('startDate', {
                required: 'Start date is required.',
              })}
              isInvalid={!!errors.startDate}
            />
            {errors.startDate && (
              <Form.Text className="text-danger">
                {errors.startDate.message}
              </Form.Text>
            )}
            {!errors.startDate && isStartDateInPast() && (
              <Alert variant="warning" className="mt-2 mb-0">
                <Alert.Heading style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  ⚠️ Warning
                </Alert.Heading>
                <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                  The start date is in the past. Are you sure you want to create an itinerary for a past date?
                </p>
              </Alert>
            )}
          </Form.Group>
          <Form.Group controlId="endDate" className="mb-3">
            <Form.Label>
              End Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              defaultValue={defaultValues ? formatDateForInput(defaultValues.endDate) : ''}
              {...register('endDate', {
                required: 'End date is required.',
              })}
              isInvalid={!!errors.endDate}
            />
            {errors.endDate && (
              <Form.Text className="text-danger">
                {errors.endDate.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="destination" className="mb-3">
            <Form.Label>
              Destination <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              defaultValue={defaultValues ? defaultValues.destination : ''}
              {...register('destination', {
                required: 'Destination is required.',
              })}
              isInvalid={!!errors.destination}
            />
            {errors.destination && (
              <Form.Text className="text-danger">
                {errors.destination.message}
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" >
            {isUpdating ? 'Update' : 'Create'} Itinerary
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
    {showAlert && (
        <AlertDisplay isUpdating={isUpdating} showAlert={showAlert} variant="success" dismissible/>
            )}
    </>
  );
};

export default CreateItineraryForm;

