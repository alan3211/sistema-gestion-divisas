import {Button, Modal} from "react-bootstrap";

export const ModalConfirm = ({showModal,closeModal,selectedItem,hacerOperacion,title,icon,closeModalAndReturn}) => {

    return(
        <Modal centered show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
            <Modal.Title>
                <i className={icon}></i>
                Alerta
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {title}
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={closeModalAndReturn}>
                No
            </Button>
            <Button variant="primary" onClick={()=> hacerOperacion(selectedItem)}>
                Sí
            </Button>
        </Modal.Footer>
    </Modal>);
}