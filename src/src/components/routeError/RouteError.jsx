
import { Modal, Button } from "react-bootstrap";



function RouteError({showe,handleClosee}) {
  return (
    <Modal dialogClassName="modal-height" scrollable={true} show={showe} onHide={handleClosee} >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Failed to generate route </Modal.Title>
        </Modal.Header>
        <Modal.Body>
<p>
It was not possible to generate the route, please check the fields you wrote</p>
</Modal.Body>

        <Modal.Footer>
         
          <Button variant="primary" onClick={handleClosee}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default RouteError;
