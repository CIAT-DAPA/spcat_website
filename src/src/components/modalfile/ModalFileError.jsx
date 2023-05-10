import { Modal, Button } from "react-bootstrap";


function ModalFileError({show,handleClose,textModal,titleModal}) {
  return (
    <Modal dialogClassName="modal-height" scrollable={true} show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">{titleModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
<p>{textModal}</p>
</Modal.Body>

        <Modal.Footer>
         
          <Button variant="primary text-white" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default ModalFileError;