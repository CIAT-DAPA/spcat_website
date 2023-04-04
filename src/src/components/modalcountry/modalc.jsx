import { Modal, Button } from "react-bootstrap";


function CountryModal({showc,handleClosec}) {
  return (
    <Modal dialogClassName="modal-height" scrollable={true} show={showc} onHide={handleClosec} >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">No selected country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
<p>you must to select a country to add to map</p>
</Modal.Body>

        <Modal.Footer>
         
          <Button variant="primary" onClick={handleClosec}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default CountryModal;
