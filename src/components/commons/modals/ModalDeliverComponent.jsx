import {Button, Modal} from "react-bootstrap";
import {DenominacionComponent} from "../../operacion/denominacion/DenominacionComponent";
import {useForm} from "../../../hook/useForm";
import {useMemo, useState} from "react";
import {dataG} from "../../../App";
import {realizarOperacion} from "../../../services/operaciones-services";
import {ModalCambio} from "./ModalCambio";
import {
    eliminarDenominacionesConCantidadCero, encryptRequest,
    getDenominacion,
    obtenerObjetoDenominaciones
} from "../../../utils/utils";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Denominacion} from "../../operacion/denominacion/Denominacion";

export const ModalDeliverComponent = ({configuration}) =>{

    const {showCustomModal,setShowCustomModal,operacion,data} = configuration;
    const [isOkRecibido,setIsOkRecibido] = useState(true);
    const [isOkEntregado,setIsOkEntregado] = useState(true);
    const [showCambio,setShowCambio] = useState(false);
    const [diferencia,setDiferencia] =  useState(0.0);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });
    const navigator = useNavigate();

    //Muestra el título correcto
    const titulo = `Operación ${operacion.tipo_operacion === "1" ? 'Compra': 'Venta'}`;

    // Calcula el valor del monto de la parte decimal con 2 digitos
    const calculaValorMonto = useMemo(() => {
        if (operacion.tipo_operacion === '2') {
            const valoresDecimalesDivisas = parseFloat(operacion.cantidad_entregada) - parseInt(operacion.cantidad_entregada);
            setDiferencia(valoresDecimalesDivisas);
            const conversionAPesos = valoresDecimalesDivisas * parseFloat(operacion.tipo_cambio);
            const diferenciaAMostrar = parseFloat(operacion.monto) - conversionAPesos;
            return diferenciaAMostrar.toFixed(2);
        }
        return parseFloat(operacion.monto);
    }, [operacion.cantidad_entregada, operacion.tipo_cambio, operacion.monto, operacion.tipo_operacion]);

    // Muestra la divisa correspondiente
    const muestraDivisa = () => operacion.tipo_operacion === "1" ? operacion.moneda : 'MXP';
    
    const {formValues,handleInputChange} = useForm(getDenominacion(muestraDivisa()));
    
    const denominacion = useForm(getDenominacion(operacion.moneda === "MXP" ? `MXP`:operacion.moneda));

    const closeCustomModal = () => setShowCustomModal(false);

    const hacerOperacion = async () => {

        if(operacion.tipo_operacion === '1') {
            formValues.tipoOperacion = "COMPRA";
            denominacion.formValues.tipoOperacion = "COMPRA";
        }else{
            formValues.tipoOperacion = "VENTA";
            denominacion.formValues.tipoOperacion = "VENTA";
        }

        if(formValues.divisa === "MXP" && operacion.tipo_operacion === '1'){
            formValues.movimiento = "ENTREGA CLIENTE";
        }else if(formValues.divisa === "MXP" && operacion.tipo_operacion === '2'){
            formValues.movimiento = "RECIBE CLIENTE";
        }

        if( denominacion.formValues.divisa !== "MXP" && operacion.tipo_operacion === '1'){
            denominacion.formValues.movimiento = "RECIBE CLIENTE";
        }else if(denominacion.formValues.divisa !== "MXP" && operacion.tipo_operacion === '2'){
            denominacion.formValues.movimiento = "ENTREGA CLIENTE";
        }

        eliminarDenominacionesConCantidadCero(formValues);
        eliminarDenominacionesConCantidadCero(denominacion.formValues);


        const values = {
            cliente: data.cliente,
            ticket: data.ticket,
            divisa: operacion.moneda,
            cantidad_entregar: parseInt(operacion.cantidad_entregada),
            monto: parseFloat(calculaValorMonto),
            usuario: dataG.username,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia:0.0,
            denominacion:[
                obtenerObjetoDenominaciones(formValues),
                obtenerObjetoDenominaciones(denominacion.formValues),
            ]
        }

        const encryptedData = encryptRequest(values);
        console.log(encryptedData);

        const resultado = await realizarOperacion(encryptedData);
        // Validar si tenemos que darle cambio
        if(resultado){

            if(parseFloat(operacion.monto)-parseFloat(calculaValorMonto) > 0){
                setShowCambio(true);
            }else{
                toast.success('La operación fue exitosa.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                });
                navigator("/inicio");
            }
            console.log(resultado);
        }


    }

    /*
    *  title={`Entregado del cliente (${operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})`}
                                    handleInputChange={denominacion.handleInputChange}
                                    moneda={operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda}
                                    importe={parseInt(operacion.cantidad_entregada)}
                                    setIsOkEntregado={setIsOkEntregado}
    *
    * */

    const options = {
        title: `Recibido del cliente (${muestraDivisa()})`,
        importe: parseInt(operacion.monto),
        calculaValorMonto,
        habilita,
        setHabilita,
    }

    const optionsE = {
        title: `Entregado del cliente (${operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})`,
        importe: parseInt(operacion.cantidad_entregada),
        calculaValorMonto,
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
                                {/*<DenominacionComponent
                                    title={`Recibido del cliente (${muestraDivisa()})`}
                                    handleInputChange={handleInputChange}
                                    moneda={muestraDivisa()} importe={calculaValorMonto()}
                                    setIsOkRecibido={setIsOkRecibido}
                                    type/>*/}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <Denominacion type="E" moneda={operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda} options={optionsE}/>
                                {/*<DenominacionComponent
                                    title={`Entregado del cliente (${operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})`}
                                    handleInputChange={denominacion.handleInputChange}
                                    moneda={operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda}
                                    importe={parseInt(operacion.cantidad_entregada)}
                                    setIsOkEntregado={setIsOkEntregado}
                                />*/}
                            </div>
                    </div>

                </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={()=> hacerOperacion()} disabled={habilita.entrega || habilita.recibe}>
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
                        data={data}
                        calculaValorMonto={calculaValorMonto}
                        habilita={habilita}
                        setHabilita={setHabilita}
                    />
            }

        </>
    );
}