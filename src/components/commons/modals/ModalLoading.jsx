import {Modal} from "react-bootstrap";
import {CircleLoader} from "react-spinners";

export const ModalLoading = ({options}) =>{
        return (
            <Modal centered size="sm" show={options.showModal} onHide={options.closeCustomModal}>
                <Modal.Body>
                    <p className="text-center"><strong>{options.title}</strong></p>
                    <div className="row">
                        <div className="col-md-12 justify-content-center d-flex">
                            <CircleLoader
                                color="#012970"
                                loading={options.showModal}
                                size={50}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
}