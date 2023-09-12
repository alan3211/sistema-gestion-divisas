import {Button, Modal} from "react-bootstrap";

export const ModalDetalleTool = ({options,children}) => {
    return (
        <Modal centered size="lg" show={options.showModal} onHide={options.closeCustomModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h5 className="text-blue">
                        <i className="bi bi-folder-fill m-2"></i>
                        {options.title}
                    </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export const ModalAccionTesoreriaTool = ({options,children}) => {
    return (
        <Modal centered size="lg" show={options.showModal} onHide={options.closeCustomModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h5 className="text-blue">
                        <i className="bx bx-money m-2"></i>
                        {options.title}
                    </h5>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {children}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={options.onAccion}>
                    <i className="bi bi-save me-1"></i>
                    Guardar
                </Button>
            </Modal.Footer>

        </Modal>
    );
}

export const ModalAccionCancelarTool = ({options,children}) => {
    return (
        <Modal centered size="lg" show={options.showModal} onHide={options.closeCustomModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h5>
                        <i className="bi bi-x-circle m-2 text-danger"></i>
                        {options.title}
                    </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{options.subtitle}</p>
                {children}
            </Modal.Body>
        </Modal>
    );
}