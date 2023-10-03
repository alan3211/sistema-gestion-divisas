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

export const ModalDeliverComponent = ({configuration}) =>{

    console.log("Configuracion ",configuration)
    const {showCustomModal,setShowCustomModal,operacion,datos} = configuration;
    const [showCambio,setShowCambio] = useState(false);
    const [showImpresion,setShowImpresion] = useState(false);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });
    const navigator = useNavigate();
    const {
        denominacionR,
        denominacionE,
    } = useContext(DenominacionContext);


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
            denominacion:[
                obtenerObjetoDenominaciones(formValuesR),
                obtenerObjetoDenominaciones(formValuesE),
            ]
        }

        const encryptedData = encryptRequest(values);

        const resultadoPromise = realizarOperacion(encryptedData);

        try {
            await toast.promise(resultadoPromise, {
                pending: {
                    message:'La operación está en proceso...',
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                },
                error: {
                    message:'Hubo un error en la operación 🤯',
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                }
            });

            if (resultadoPromise) {
                if (redondearNumero(parseFloat(operacion.monto) - parseFloat(calculaValorMonto)) >= 1) {
                    setShowCambio(true);
                } else {
                    toast.success('La operación fue exitosa.', OPTIONS);

                    // TODO Integrar la parte de la impresion de tickets
                    // 1.- Validar que se muestre el modal
                    // 2.- Imprimir el ticket
                    setShowImpresion(true);

                    navigator("/inicio");
                }
                console.log(resultadoPromise);
            }
        } catch (error) {
            // Manejar el error si la promesa es rechazada
            console.error(error);
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
                        cambio={(redondearNumero(operacion.monto-calculaValorMonto))}
                        showModalCambio={showCambio}
                        setShowModalCambio={setShowCambio}
                        operacion={operacion}
                        data={datos}
                        habilita={habilita}
                        setHabilita={setHabilita}
                    />
            }

        </>
    );
}