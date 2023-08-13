import {Button, Modal} from "react-bootstrap";
import {DenominacionComponent} from "../../operacion/denominacion/DenominacionComponent";
import {useForm} from "../../../hook/useForm";
import {useState} from "react";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services/operaciones-services";
import {ModalCambio} from "./ModalCambio";
import {
    eliminarDenominacionesConCantidadCero,
    getDenominacion,
    obtenerObjetoDenominaciones
} from "../../../utils/utils";

export const ModalDeliverComponent = ({configuration}) =>{

    const {showModal,setShowModal,closeModal,selectedItem,showCustomModal,setShowCustomModal,operacion,data} = configuration;
    const [isOkRecibido,setIsOkRecibido] = useState(true);
    const [isOkEntregado,setIsOkEntregado] = useState(true);
    const [showCambio,setShowCambio] = useState(false);

    const calculaValorMonto = () => {
        return parseFloat(operacion.monto-(operacion.cantidad_entregada - parseInt(operacion.cantidad_entregada))).toFixed(2);
    }


    const muestraDivisa = () => {
        if(operacion.tipo_operacion === "1"){
            return operacion.moneda;
        }else{
            return 'MXP';
        }
    }

    const {formValues,handleInputChange} = useForm(getDenominacion(muestraDivisa()));


    const denominacion_USD = useForm(getDenominacion(operacion.moneda === "MXP" ? `MXP`:operacion.moneda));

    const closeCustomModal = () => {
        setShowCustomModal(false);
    }

    const hacerOperacion = async () => {

        if(operacion.tipo_operacion === '1') {
            formValues.tipoOperacion = "COMPRA";
            denominacion_USD.formValues.tipoOperacion = "COMPRA";
        }else{
            formValues.tipoOperacion = "VENTA";
            denominacion_USD.formValues.tipoOperacion = "VENTA";
        }

        if(formValues.divisa === "MXP" && operacion.tipo_operacion === '1'){
            formValues.movimiento = "ENTREGA CLIENTE";
        }else if(formValues.divisa === "MXP" && operacion.tipo_operacion === '2'){
            formValues.movimiento = "RECIBE CLIENTE";
        }

        if( denominacion_USD.formValues.divisa !== "MXP" && operacion.tipo_operacion === '1'){
            denominacion_USD.formValues.movimiento = "RECIBE CLIENTE";
        }else if(denominacion_USD.formValues.divisa !== "MXP" && operacion.tipo_operacion === '2'){
            denominacion_USD.formValues.movimiento = "ENTREGA CLIENTE";
        }

        eliminarDenominacionesConCantidadCero(formValues);
        eliminarDenominacionesConCantidadCero(denominacion_USD.formValues);


        const values = {
            cliente: data.cliente,
            ticket: data.ticket,
            divisa: operacion.moneda,
            cantidad_entregar: parseInt(operacion.cantidad_entregada),
            monto: parseFloat(calculaValorMonto()),
            usuario: dataG.username,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia:0.0,
            denominacion:[
                obtenerObjetoDenominaciones(formValues),
                obtenerObjetoDenominaciones(denominacion_USD.formValues),
            ]
        }

        const resultado = await realizarOperacion(values);

        // Validar si tenemos que darle cambio
        if(resultado){

            setShowCambio(true)
            console.log(resultado);

        }


    }



    return(
        <>
            <Modal centered size="lg" show={showCustomModal} onHide={closeCustomModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>
                            <i className="bi bi-currency-exchange m-2"></i>
                            Operación {operacion.tipo_operacion === "1" ? `Compra`: `Venta`}
                        </h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="cantidad"><strong>Importe:</strong></label>
                                <input type="text" className="form-control" id="importe" value={calculaValorMonto()} readOnly />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="cantidad"><strong>Cantidad a entregar:</strong></label>
                                <input type="text" className="form-control" id="cantidad" value={parseInt(operacion.cantidad_entregada)} readOnly />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="tipoMoneda"><strong>Tipo de moneda:</strong></label>
                                <select className="form-control" id="tipoMoneda" disabled>
                                    <option value={operacion.moneda}>{operacion.moneda}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <DenominacionComponent title={`Recibido del cliente (${muestraDivisa()})`} handleInputChange={handleInputChange} moneda={muestraDivisa()} importe={calculaValorMonto()} setIsOkRecibido={setIsOkRecibido} type/>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <DenominacionComponent title={`Entregado del cliente (${operacion.moneda === "MXP" ? `MXP`:operacion.moneda})`} handleInputChange={denominacion_USD.handleInputChange} moneda={operacion.moneda === "MXP" ? `MXP`:operacion.moneda} importe={parseInt(operacion.cantidad_entregada)} setIsOkEntregado={setIsOkEntregado} type={false}/>
                            </div>
                    </div>

                </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={()=> hacerOperacion()} disabled={isOkRecibido || isOkEntregado}>
                        Finalizar Operación
                    </Button>
                </Modal.Footer>
            </Modal>

            {
                showCambio
                    &&
                    <ModalCambio
                        cambio={(operacion.cantidad_entregada - parseInt(operacion.cantidad_entregada)).toPrecision(1)}
                        showModalCambio={showCambio}
                        setShowModalCambio={setShowCambio}
                        operacion={operacion}
                        data={data}
                    />
            }

        </>
    );
}