import {Button, Modal} from "react-bootstrap";
import {useContext, useState} from "react";
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest,
    getDenominacion,
    obtenerObjetoDenominaciones, redondearNumero
} from "../../../utils";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Denominacion} from "../../operacion/denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {usePrinter} from "../../../hook/usePrinter";
import {ModalTicket} from "./ModalTicket";


export const ModalCambio = ({cambio,showModalCambio,setShowModalCambio,operacion,data,habilita,setHabilita}) => {

    const navigator = useNavigate();
    const {denominacionC} = useContext(DenominacionContext);
    const {imprimir,imprimeTicketNuevamente} = usePrinter({"No Usuario": data.Cliente,
        "No Ticket": data.ticket});
    const [showModal,setShowModal] = useState(false)

    const options = {
        title: '',
        importe: redondearNumero(cambio),
        habilita,
        setHabilita
    }

    // Solicitud de cambio
    const solicitaCambio = () => {

    }

    const closeCustomModal = () => setShowModalCambio(false);

    const guardarCambio = async() => {

        let denominacionesCambio = denominacionC.getValues();

        const formValuesC = getDenominacion("MXP",denominacionesCambio);

        if(operacion.tipo_operacion === '1') {
            formValuesC.tipoOperacion = 'COMPRA';
        }else{
            formValuesC.tipoOperacion = 'VENTA';
        }

        formValuesC.divisa = 'MXP';
        formValuesC.movimiento = 'CAMBIO AL USUARIO';

        eliminarDenominacionesConCantidadCero(formValuesC);

        console.log("CAMBIO!: ",cambio);

        const values = {
            cliente: data.cliente,
            ticket: data.ticket,
            cantidad_entregar: parseInt(cambio),
            monto: '0.0',
            divisa:'MXP',
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia: 0.0,
            denominacion:[
                obtenerObjetoDenominaciones(formValuesC),
            ]
        }
        const encryptedData = encryptRequest(values);

        const resultado = await realizarOperacion(encryptedData);

        // Validar si tenemos que darle cambio
        if(resultado){
            //imprimir(0);
            setShowModal(true)
        }
    }

    const imprimeTicket = () =>{
        imprimeTicketNuevamente(0)
    }

    return(
        <>
            <Modal centered size="lg" show={showModalCambio}>
                <Modal.Header>
                    <Modal.Title>
                        <h5 className="text-blue">
                            <i className="bx bx-money m-2"></i>
                            Entrega de Cambio (MXP)
                        </h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row justify-content-center">
                        <div className="col-md-5 mb-3 d-flex">
                            <div className="form-floating flex-grow-1">
                                <input type="text"
                                       className={`form-control mb-1`}
                                       id="floatingCE"
                                       value={redondearNumero(cambio)}
                                       readOnly
                                />
                                <label htmlFor="floatingCE">CANTIDAD A ENTREGAR <i>(MXP)</i></label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <Denominacion type="C" moneda="MXP" options={options}/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="success" onClick={()=> solicitaCambio()}>
                        <i className="bi bi-cash me-2"></i>
                        SOLICITAR CAMBIO
                    </Button>
                    <Button variant="primary" disabled={denominacionC.calculateGrandTotal != redondearNumero(cambio)} onClick={guardarCambio}>
                        <i className="bi bi-arrow-left-right me-2"></i>
                        ENTREGAR CAMBIO
                    </Button>
                </Modal.Footer>
            </Modal>

            {
                showModal && (
                    <ModalTicket title="¿Se imprimió el ticket correctamente?"
                                  showModal={showModal}
                                  closeModalAndReturn={imprimeTicket}
                                  hacerOperacion={()=> {
                                      toast.success('Se ha entregado el cambio correspondiente.', {
                                          position: "top-center",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          theme: "colored",
                                      });
                                      setShowModal(false)
                                      navigator('/inicio')
                                  }}
                                  icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }

        </>
    );
}