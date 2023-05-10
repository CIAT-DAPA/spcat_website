import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

function Loader({show, handleClose}) {

  return (
    <>
      
      <Modal show={show} onHide={handleClose} centered>
        
        <Modal.Body className="d-flex align-items-center justify-content-center flex-column">
          <Spinner animation="border" className="mb-2" />
          <span> <b>Loading...</b></span>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Loader;
