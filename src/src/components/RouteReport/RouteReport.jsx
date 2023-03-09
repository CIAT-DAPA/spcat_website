import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const RouteReport = ({show,handleClose}) => {
  /* const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 */
  return (
    <>
      

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Reporte de rutas</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '400px' }}>
          <p>
           Aqui ira todo lo de las rutas
          </p>
        </Modal.Body>
        <Modal.Footer>
         
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RouteReport;