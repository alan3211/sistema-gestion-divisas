import {HeaderComponent} from "./header/HeaderComponent";
import {AsideComponent} from "./aside/AsideComponent";
import {FooterComponent} from "./footer/FooterComponent";
import {Button, Modal} from "react-bootstrap";
import {useMonitorSesion} from "../../hook/";
import {encryptRequest, formatTime} from "../../utils";
import {dataG} from "../../App";
import {finSesion} from "../../services";
import {NotAuthenticated} from "./NotAuthenticated";

export const MainLayout = ({children}) => {

    const {
        authenticated,
        modalVisible,
        mensaje,
        countdown,
        navigate,
        renuevaSesion,
        handleSessionExpiration,
    } = useMonitorSesion();

    return (
        <>
            {authenticated ? (
                <>
                    <HeaderComponent />
                    <AsideComponent />
                    {children}
                    <FooterComponent />

                    <Modal animation show={modalVisible} onHide={!modalVisible}>
                        <Modal.Header closeButton>
                            <p>
                                <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                                <strong>¡Atención! - Tu sesión está a punto de expirar</strong>
                            </p>
                        </Modal.Header>
                        <Modal.Body>
                            {mensaje.mensaje}
                            <strong className="text-danger-emphasis">{formatTime(countdown)}</strong>
                            <p className="mt-2">¿Deseas mantenerla activa?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    handleSessionExpiration();
                                    navigate("/");
                                }}
                            >
                                <i className="bi bi-x-circle-fill me-2"></i>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={renuevaSesion}>
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Mantener
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ):
            (<NotAuthenticated/>)}
        </>
    );
}