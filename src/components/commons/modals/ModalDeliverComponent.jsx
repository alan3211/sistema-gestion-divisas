import {Button, Modal} from "react-bootstrap";
import {useContext, useMemo, useState} from "react";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services";
import {ModalCambio} from "./ModalCambio";
import {
    eliminarDenominacionesConCantidadCero, encryptRequest,
    getDenominacion,
    obtenerObjetoDenominaciones, OPTIONS
} from "../../../utils";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Denominacion} from "../../operacion/denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";

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


    //Muestra el título correcto
    const titulo = `Operación ${operacion.tipo_operacion === "1" ? 'Compra': 'Venta'}`;

    // Calcula el valor del monto de la parte decimal con 2 digitos
    const calculaValorMonto = useMemo(() => {
        console.log(operacion)
        if (operacion.tipo_operacion === '2') {
            const valoresDecimalesDivisas = parseFloat(operacion.cantidad_entregar) - parseInt(operacion.cantidad_entregada);
            const conversionAPesos = valoresDecimalesDivisas * parseFloat(operacion.tipo_cambio);
            const diferenciaAMostrar = parseFloat(operacion.monto) - conversionAPesos;
            return diferenciaAMostrar.toFixed(2);
        }
        return parseFloat(operacion.monto);
    }, [operacion.cantidad_entregada, operacion.tipo_cambio, operacion.monto, operacion.tipo_operacion]);

    // Muestra la divisa correspondiente
    const muestraDivisa = () => operacion.tipo_operacion === "1" ? operacion.moneda : 'MXP';

    const closeCustomModal = () => setShowCustomModal(false);

    const hacerOperacion = async () => {

        let denominacionesRecibe = denominacionR.getValues();
        let denominacionesEntrega = denominacionE.getValues();
        let formValuesE = {}
        let formValuesR = {}

        if (operacion.tipo_operacion === '1') {
            formValuesE = getDenominacion('MXP',denominacionesEntrega)
            formValuesR = getDenominacion(operacion.moneda === "MXP" ? `MXP`:operacion.moneda,denominacionesRecibe)
            formValuesE.movimiento = "RECIBE CLIENTE";
            formValuesR.movimiento = "ENTREGA CLIENTE";
            formValuesR.tipoOperacion = "COMPRA";
            formValuesE.tipoOperacion = "COMPRA";
        }else{
            formValuesE = getDenominacion(operacion.moneda === "MXP" ? `MXP`:operacion.moneda,denominacionesEntrega)
            formValuesR = getDenominacion('MXP',denominacionesRecibe)
            formValuesR.movimiento = "RECIBE CLIENTE";
            formValuesE.movimiento = "ENTREGA CLIENTE";
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

            // Resto de tu código

            if (resultadoPromise) {
                if (parseFloat(operacion.monto) - parseFloat(calculaValorMonto) > 0) {
                    setShowCambio(true);
                } else {
                    toast.success('La operación fue exitosa.', OPTIONS);
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
        title: `Recibido del cliente (${muestraDivisa()})`,
        importe: parseFloat(parseInt(operacion.monto)).toFixed(2),
        calculaValorMonto:parseFloat(calculaValorMonto).toFixed(2),
        habilita,
        setHabilita,
    }

    const optionsE = {
        title: `Entregado del cliente (${operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})`,
        importe: parseFloat(parseInt(operacion.cantidad_entregada)).toFixed(2),
        calculaValorMonto:parseFloat(calculaValorMonto).toFixed(2),
        habilita,
        setHabilita,
    }

    return(
        <>
            <Modal centered size="lg" show={showCustomModal} onHide={closeCustomModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5 className="text-blue">
                            <i className="bi bi-currency-exchange m-2"></i>
                            {titulo}
                        </h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="cantidad"><strong>Importe</strong></label>
                                <input type="text" className="form-control" id="importe" value={calculaValorMonto} readOnly />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="cantidad"><strong>Cantidad a entregar</strong></label>
                                <input type="text" className="form-control" id="cantidad" value={parseInt(operacion.cantidad_entregada)} readOnly />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="tipoMoneda"><strong>Tipo de moneda</strong></label>
                                <select className="form-control" id="tipoMoneda" disabled>
                                    <option value={operacion.moneda}>{operacion.moneda}</option>
                                </select>
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
                        cambio={(parseFloat(operacion.monto)-calculaValorMonto).toFixed(2)}
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