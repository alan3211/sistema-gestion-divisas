import {Button, Modal} from "react-bootstrap";
import {useContext, useMemo, useState} from "react";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services";
import {ModalCambio} from "./ModalCambio";
import {
    eliminarDenominacionesConCantidadCero, encryptRequest,
    getDenominacion,
    obtenerObjetoDenominaciones, OPTIONS, redondearNumero, validarMoneda
} from "../../../utils";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Denominacion} from "../../operacion/denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {usePrinter} from "../../../hook/usePrinter";
import {ModalTicket} from "./ModalTicket";

export const ModalDeliverComponent = ({configuration}) =>{

    const {showCustomModal,setShowCustomModal,operacion,datos} = configuration;
    const [showCambio,setShowCambio] = useState(false);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });
    const navigator = useNavigate();
    const {
        denominacionR,
        denominacionE,
    } = useContext(DenominacionContext);
    const {imprimir,imprimeTicketNuevamente} = usePrinter();
    const [showModal,setShowModal] = useState(false)

    //Muestra el título correcto
    const titulo = `Operación ${operacion.tipo_operacion === "1" ? 'Compra': 'Venta'}`;

    // Calcula el valor del monto de la parte decimal con 2 digitos
    const calculaValorMonto = useMemo(() => {
        console.log("OPERACIONES -*",operacion)
        if (operacion.tipo_operacion === '2') {
            const conversionAPesos = operacion.decimal_sobrante * parseFloat(operacion.tipo_cambio);
            const diferenciaAMostrar = parseFloat(operacion.monto) - conversionAPesos;
            return diferenciaAMostrar.toFixed(2);
        }
        return parseFloat(operacion.monto);
    }, [operacion.cantidad_entregar, operacion.tipo_cambio, operacion.monto, operacion.tipo_operacion]);

    // Muestra la divisa correspondiente
    const muestraDivisa = () => operacion.tipo_operacion === "1" ? operacion.moneda : 'MXP';

    const closeCustomModal = () => setShowCustomModal(false);

    const hacerOperacion = async () => {

        let denominacionesRecibe = denominacionR.getValues();
        let denominacionesEntrega = denominacionE.getValues();
        let formValuesE;
        let formValuesR;

        if (operacion.tipo_operacion === '1') {
            formValuesE = getDenominacion('MXP',denominacionesEntrega)
            formValuesR = getDenominacion(operacion.moneda === "MXP" ? `MXP`:operacion.moneda,denominacionesRecibe)
            formValuesR.movimiento = "RECIBIMOS DEL CLIENTE";
            formValuesE.movimiento = "ENTREGA AL CLIENTE";
            formValuesR.tipoOperacion = "COMPRA";
            formValuesE.tipoOperacion = "COMPRA";
        }else{
            formValuesE = getDenominacion(operacion.moneda === "MXP" ? `MXP`:operacion.moneda,denominacionesEntrega)
            formValuesR = getDenominacion('MXP',denominacionesRecibe)
            formValuesE.movimiento = "ENTREGA AL CLIENTE";
            formValuesR.movimiento = "RECIBIMOS DEL CLIENTE";
            formValuesR.tipoOperacion = "VENTA";
            formValuesE.tipoOperacion = "VENTA";
        }

        eliminarDenominacionesConCantidadCero(formValuesR);
        eliminarDenominacionesConCantidadCero(formValuesE);

        console.log(" TOTAL INGRESADO: ",denominacionR.calculateGrandTotal());
        console.log(" monto: ",parseFloat(calculaValorMonto));
        console.log("RESTA: ",denominacionR.calculateGrandTotal() - parseFloat(calculaValorMonto));

        const values = {
            cliente: datos.Cliente,
            ticket: datos.ticket,
            divisa: operacion.moneda,
            cantidad_entregar: parseInt(operacion.cantidad_entregada),
            monto: parseFloat(calculaValorMonto),
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia:0.0,
            totalRecibido:denominacionR.calculateGrandTotal(),
            cambio:denominacionR.calculateGrandTotal() - parseFloat(calculaValorMonto),
            denominacion:[
                obtenerObjetoDenominaciones(formValuesR),
                obtenerObjetoDenominaciones(formValuesE),
            ]
        }

        console.log("ENVIO DE DENOMINACIONES",values);

        const encryptedData = encryptRequest(values);
        const resultadoPromise = realizarOperacion(encryptedData);

        if (resultadoPromise) {
            if (redondearNumero(parseFloat(operacion.monto) - parseFloat(calculaValorMonto)) >= 1) {
                setShowCambio(true);
            } else {
                //imprimir(0);
                setShowModal(true)
            }
            console.log(resultadoPromise);
        }
    }

    const options = {
        title: `Recibido del usuario (${muestraDivisa()})`,
        importe: parseFloat(parseInt(operacion.monto)),
        calculaValorMonto:parseFloat(calculaValorMonto),
        habilita,
        setHabilita,
        tipo: 'R',
    }

    const optionsE = {
        title: `Entregado al usuario (${operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})`,
        importe:parseFloat(operacion.cantidad_entregar),
        calculaValorMonto:parseFloat(calculaValorMonto),
        habilita,
        setHabilita,
        tipo: 'E',
    }

    const imprimeTicket = () =>{
        imprimeTicketNuevamente(0)
    }

    return(
        <>
            <Modal centered size="xl" show={showCustomModal} onHide={closeCustomModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5 className="text-blue">
                            <i className="bi bi-currency-exchange m-2"></i>
                            {titulo}
                        </h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row justify-content-center">
                        <div className="col-md-4 mb-3 d-flex">
                            <div className="form-floating flex-grow-1">
                                <input
                                    type="text"
                                    id="monto"
                                    name="monto"
                                    className={`form-control mb-1`}
                                    placeholder="Ingresa la cantidad a cotizar por el usuario"
                                    value={operacion.monto} readOnly
                                />
                                <label htmlFor="monto" className="form-label">IMPORTE <i>({muestraDivisa()})</i></label>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3 d-flex">
                            <div className="form-floating flex-grow-1">
                                <input
                                    type="text"
                                    id="monto"
                                    name="monto"
                                    className={`form-control mb-1`}
                                    placeholder="Ingresa la cantidad a cotizar por el usuario"
                                    value={calculaValorMonto} readOnly
                                />
                                <label htmlFor="monto" className="form-label">CANTIDAD A COTIZAR <i>({muestraDivisa()})</i></label>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3 d-flex">
                            <div className="form-floating flex-grow-1">
                                <input type="text"
                                       className={`form-control mb-1`}
                                       id="floatingCE"
                                       value={operacion.cantidad_entregar}
                                       readOnly
                                />
                                <label htmlFor="floatingCE">CANTIDAD A ENTREGAR <i>({operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})</i></label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <Denominacion type="R" moneda={muestraDivisa()} options={options}/>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <Denominacion type="E" moneda={operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda} options={optionsE}/>
                            </div>
                    </div>

                </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={()=> hacerOperacion()} disabled={habilita.entrega || habilita.recibe}>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Finalizar Operación
                    </Button>
                </Modal.Footer>
            </Modal>

            {
                showCambio
                    &&
                    <ModalCambio
                        cambio={(denominacionR.calculateGrandTotal() - parseFloat(calculaValorMonto))}
                        showModalCambio={showCambio}
                        setShowModalCambio={setShowCambio}
                        operacion={operacion}
                        data={datos}
                        habilita={habilita}
                        setHabilita={setHabilita}
                    />
            }

            {
                showModal && (
                    <ModalTicket title="¿Se imprimió el ticket correctamente?"
                                 showModal={showModal}
                                 closeModalAndReturn={imprimeTicket}
                                 hacerOperacion={()=> {
                                     toast.success('La operación fue exitosa.', OPTIONS);
                                     setShowModal(false)
                                     navigator('/inicio')
                                 }}
                                 icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }

        </>
    );
}