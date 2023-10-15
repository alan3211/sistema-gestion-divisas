import {Button, Modal} from "react-bootstrap";

export const ModalTicket = ({showModal,hacerOperacion,title,icon,closeModalAndReturn}) => {

    return(
        <Modal show={showModal} onHide={() => {}} >
            <Modal.Header>
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
                    NO
                </Button>
                <Button variant="primary" onClick={()=> hacerOperacion()}>
                    SÍ
                </Button>
            </Modal.Footer>
        </Modal>);
}