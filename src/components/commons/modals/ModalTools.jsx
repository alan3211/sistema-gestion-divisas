import {Modal} from "react-bootstrap";

export const ModalDetalleTool = ({options,children}) => {
    return (
        <Modal fullscreen show={options.showModal} onHide={options.closeCustomModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h5 className="text-blue">
                        <i className="bi bi-folder-fill m-2"></i>
                        {options.title}
                    </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export const ModalAccionTesoreriaTool = ({options,children}) => {
    return (
        <Modal fullscreen show={options.showModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>
                    <h5>
                        <i className={options.icon}></i>
                        {options.title}
                    </h5>
                </Modal.Title>
                <button type="button" className="btn-close" onClick={options.closeModal} aria-label="Close"></button>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                <p>{options.subtitle}</p>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export const ModalAccionCancelarTool = ({options,children}) => {
    return (
        <Modal fullscreen show={options.showModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>
                    <h5>
                        <i className="bi bi-x-circle m-2 text-danger"></i>
                        {options.title}
                    </h5>
                </Modal.Title>
                <button type="button" className="btn-close" onClick={options.closeModal} aria-label="Close"></button>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                <p>{options.subtitle}</p>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export const ModalAccionesTool = ({options,children}) => {
    return (
        <Modal fullscreen show={options.showModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>
                    <h5>
                        <i className={options.icon}></i>
                        {options.title}
                    </h5>
                </Modal.Title>
                <button type="button" className="btn-close" onClick={options.closeModal} aria-label="Close"></button>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                <p>{options.subtitle}</p>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export const ModalGenericTool = ({options,children}) => {
    return (
        <Modal fullscreen show={options.showModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>
                    <h5 className="card-title">
                        <i className={options.icon}></i>
                        {options.title}
                    </h5>
                </Modal.Title>
                {!options.waiting && <button type="button" className="btn-close" onClick={options.closeModal} aria-label="Close" style={{ fontSize: '48px' }} ></button>}
            </Modal.Header>
            <Modal.Body style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                <p>{options.subtitle}</p>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export const ModalGenericPLDTool = ({options,children}) => {
    return (
        <Modal size={options.size} centered show={options.showModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>
                    <h5 className="card-title">
                        <i className={options.icon}></i>
                        {options.title}
                    </h5>
                </Modal.Title>
                {!options.waiting && <button type="button" className="btn-close" onClick={options.closeModal} aria-label="Close" style={{ fontSize: '48px' }} ></button>}
            </Modal.Header>
            <Modal.Body style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                <p>{options.subtitle}</p>
                {children}
            </Modal.Body>
        </Modal>
    );
}