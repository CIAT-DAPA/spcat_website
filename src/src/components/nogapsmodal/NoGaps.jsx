import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function NoGaps({showg,handleCloseg}) {
 

  return (
    <>
      

      <Modal show={showg} onHide={handleCloseg} centered>
        <Modal.Header closeButton>
          <Modal.Title>No Gaps</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        There are no gaps for this area
        </Modal.Body>
        <Modal.Footer>
         
          <Button variant="primary" onClick={handleCloseg}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NoGaps;
