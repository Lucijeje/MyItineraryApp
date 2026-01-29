import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { diaryEntryContext } from './DiaryEntryContext';
import { useForm } from 'react-hook-form';
import "./DiaryEntryForm.css"

function DiaryEntryForm({dayPlanId, itineraryId, id, action, date, dayOfWeek}) {
    console.log(itineraryId)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { handlerMap } = useContext(diaryEntryContext);

  const { register, handleSubmit } = useForm();
  
   // Funkce pro zpracování formuláře
   const handleForm = async (formData) => {
    try {
        console.log(formData);
        formData.id = id; // Preserves the existing ID if it's an update
        const actionMethod = formData.id ? 'diaryEntryUpdate' : 'diaryEntryCreate';

        const payload = {
            ...formData,
            id: formData.id || undefined,
            dayPlanId: dayPlanId,
            itineraryId: itineraryId,
        };

        // Include date and dayOfWeek only if it's a create action
        if (!formData.id) {
            payload.date = date;
            payload.dayOfWeek = dayOfWeek;
        }

        await handlerMap[actionMethod](payload);
        handleClose();
    } catch (error) {
        console.error('Error handling form:', error);
    }
};
  return (
    <>
      <Button className="full-width-button" size="sm" variant="primary" onClick={handleShow}>
       {action} Diary
      </Button>

      <Modal show={show} onHide={handleClose}>
      <Form onSubmit= {handleSubmit(handleForm)}>
        <Modal.Header closeButton>
          <Modal.Title>{action} Diary Entry form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group controlId="name">
            <Form.Label>Name of diary entry</Form.Label>
            <Form.Control  type="text" {...register('name')} />
          </Form.Group>
          <Form.Group controlId="text">
            <Form.Label>Text</Form.Label>
            <Form.Control  type="text" {...register('text')} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleClose}>
          {action}
          </Button>
        </Modal.Footer>
    </Form>
      </Modal>
    </>
  );
}

export default DiaryEntryForm;