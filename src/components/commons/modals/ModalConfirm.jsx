import {Button, Modal} from "react-bootstrap";

export const ModalConfirm = ({showModal,closeModal,selectedItem,hacerOperacion,title,setData}) => {
    return(
        <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
            <Modal.Title>
                <i className="ri-error-warning-fill text-warning m-2"></i>
                Alerta
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {title}
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
                No
            </Button>
            <Button variant="primary" onClick={()=> hacerOperacion(selectedItem)}>
                Sí
            </Button>
        </Modal.Footer>
    </Modal>);
}