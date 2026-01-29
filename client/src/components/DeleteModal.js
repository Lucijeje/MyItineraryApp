import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./deleteModal.css"

function DeleteModal({ onDelete, name, item, id }) {
  const [show, setShow] = useState(false); //stav na držení informace o tom, zda je okno otevřené nebo zavřené

  const handleClose = () => setShow(false); //uzavírá modální okno
  const handleShow = () => setShow(true); // stisknutím tlačítka se objevuje modalni okno

  const handleDelete = async () => { //posílá informaci do CardComponent, že se může itinerář smazat
    await onDelete(id); 
    handleClose(); //uzavírá okno
  };

  return (
    <>
      <Button className='width' size="sm" variant="danger" onClick={handleShow}>Delete</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {item}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete {name} {item}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteModal;
