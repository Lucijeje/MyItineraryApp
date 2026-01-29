import { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { dayPlanContext } from './DayPlanContext';
import { useForm } from 'react-hook-form';

function DayPlanForm({dayPlan}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { handlerMap } = useContext(dayPlanContext);

  console.log(dayPlan)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      description: dayPlan?.description || ''
    }
  });

  useEffect(() => {
    if (show && dayPlan) {
      reset({
        description: dayPlan.description || ''
      });
    }
  }, [show, dayPlan, reset]);

   const handleForm = async (formData) => {
    console.log(formData)
    try {
        console.log(formData)
      await handlerMap.dayPlanUpdate({
        ...formData,
        id: dayPlan.id || undefined,
      });
      handleClose();
    } catch (error) {
        console.error('Error handling form:', error);
      }
    };

  return (
    <>
      <Button size="sm" variant="secondary" onClick={handleShow}>
        Update DayPlan
      </Button>

      <Modal show={show} onHide={handleClose}>
      <Form onSubmit= {handleSubmit(handleForm)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Day Plan form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4}
              {...register('description')} 
              placeholder="Enter day plan description..."
            />
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

export default DayPlanForm;