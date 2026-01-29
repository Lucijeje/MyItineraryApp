import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { locationContext } from './LocationContext';
import { useForm } from 'react-hook-form';

function LocationForm({dayplanId}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { state, handlerMap } = useContext(locationContext);

  console.log(dayplanId)

  const { register, handleSubmit, reset } = useForm();

   // Funkce pro zpracování formuláře
   const handleForm = async (formData) => {
    try {
        console.log(formData)
      const action = formData.id ? 'locationUpdate' : 'locationCreate';
      await handlerMap[action]({
        ...formData,
        id: formData.id || undefined,
        dayPlanId: dayplanId
      });
      handleClose();
    } catch (error) {
        console.error('Error handling form:', error);
      }
    };

  return (
    <>
      <Button size='sm' variant="primary" onClick={handleShow}>
        Add Location
      </Button>

      <Modal show={show} onHide={handleClose}>
      <Form onSubmit= {handleSubmit(handleForm)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Location form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group controlId="name">
            <Form.Label>Name of location</Form.Label>
            <Form.Control  type="text" {...register('name')} />
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control  type="text" {...register('address')} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
    </Form>
      </Modal>
    </>
  );
}

export default LocationForm;