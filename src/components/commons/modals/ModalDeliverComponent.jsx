import {Button, Modal} from "react-bootstrap";
import {useContext, useEffect, useMemo, useState} from "react";
import {dataG} from "../../../App";
import {obtieneDenominaciones, realizarOperacion} from "../../../services";
import {ModalCambio} from "./ModalCambio";
import {
    eliminarDenominacionesConCantidadCero, encryptRequest,
    getDenominacion,
    obtenerObjetoDenominaciones, OPTIONS, redondearNumero, validarMoneda, validarNumeros
} from "../../../utils";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Denominacion} from "../../operacion/denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {usePrinter,useMovimientosDotaciones} from "../../../hook/";
import {ModalTicket} from "./ModalTicket";
import {ModalGenericTool} from "./ModalTools";
import {useForm} from "react-hook-form";

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
        denominacionD,
    } = useContext(DenominacionContext);
    const {imprimir,imprimeTicketNuevamente} = usePrinter({"No Usuario": datos.Cliente,
        "No Ticket": datos.ticket});
    const [showModal,setShowModal] = useState(false)

    const solicitaDotacionFormulario =  useForm();
    const solicitaDotacionRapidaFormulario =  useForm();
    const [dataMoneda,setDataMoneda] = useState([]);
    const [estadoDotacion,setEstadoDotacion] = useState(false);
    const {solicitaCambio,solicitudDotacionRapida, showDotacionRapida, showCambioDeno,
        OPTIONS_DOTACION_RAPIDA,
        OPTIONS_SOL_DENOMINACION} =  useMovimientosDotaciones(
            {
                solicitaDotacionFormulario,
                solicitaDotacionRapidaFormulario,
                setEstadoDotacion,
            });


    //Muestra el título correcto
    const titulo = `Operación ${operacion.tipo_operacion === "1" ? 'Compra': 'Venta'}`;

    // Calcula el valor del monto de la parte decimal con 2 digitos
    const calculaValorMonto = useMemo(() => {
        if (operacion.tipo_operacion === '2') {
            const conversionAPesos = operacion.decimal_sobrante * parseFloat(operacion.tipo_cambio);
            const diferenciaAMostrar = parseFloat(operacion.monto) - conversionAPesos;
            return redondearNumero(diferenciaAMostrar.toFixed(2));
        }
        return redondearNumero(operacion.monto);
    }, [operacion.cantidad_entregar, operacion.tipo_cambio, operacion.monto, operacion.tipo_operacion]);

    // Muestra la divisa correspondiente
    const muestraDivisa = () => operacion.tipo_operacion === "1" ? operacion.moneda : 'MXP';

    //Cierra el modal
    const closeCustomModal = () => setShowCustomModal(false);

    const hacerOperacion = async () => {

        let denominacionesRecibe = denominacionR.getValues();
        let denominacionesEntrega = denominacionE.getValues();
        let formValuesE;
        let formValuesR;

        if (operacion.tipo_operacion === '1') {
            formValuesE = getDenominacion('MXP',denominacionesEntrega)
            formValuesR = getDenominacion(operacion.moneda === "MXP" ? `MXP`:operacion.moneda,denominacionesRecibe)
            formValuesR.movimiento = "RECIBIMOS DEL USUARIO";
            formValuesE.movimiento = "ENTREGA AL USUARIO";
            formValuesR.tipoOperacion = "COMPRA";
            formValuesE.tipoOperacion = "COMPRA";
        }else{
            formValuesE = getDenominacion(operacion.moneda === "MXP" ? `MXP`:operacion.moneda,denominacionesEntrega)
            formValuesR = getDenominacion('MXP',denominacionesRecibe)
            formValuesE.movimiento = "ENTREGA AL USUARIO";
            formValuesR.movimiento = "RECIBIMOS DEL USUARIO";
            formValuesR.tipoOperacion = "VENTA";
            formValuesE.tipoOperacion = "VENTA";
        }

        eliminarDenominacionesConCantidadCero(formValuesR);
        eliminarDenominacionesConCantidadCero(formValuesE);

        const values = {
            cliente: datos.Cliente,
            ticket: datos.ticket,
            divisa: operacion.moneda,
            cantidad_entregar: parseInt(operacion.cantidad_entregar),
            monto: parseFloat(calculaValorMonto).toFixed(2),
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia:0.0,
            totalRecibido:denominacionR.calculateGrandTotal(),
            cambio:parseFloat(denominacionR.calculateGrandTotal() - parseFloat(calculaValorMonto)),
            denominacion:[
                obtenerObjetoDenominaciones(formValuesR),
                obtenerObjetoDenominaciones(formValuesE),
            ]
        }

        const encryptedData = encryptRequest(values);
        const resultadoPromise = await realizarOperacion(encryptedData);
        let cambioFinal = denominacionR.calculateGrandTotal() - parseFloat(calculaValorMonto);
        if (redondearNumero(cambioFinal) > 0) {
            setShowCambio(true);
        } else {
            imprimir(0);
            setShowModal(true)
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

    const optionsDot = {
        title: `Solicitando cambio en (${operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})`,
        importe: solicitaDotacionFormulario.watch("denominacion") !== '0' ? parseFloat(solicitaDotacionFormulario.watch("denominacion")):0,
        calculaValorMonto:0,
        habilita,
        setHabilita,
        tipo: 'D',
    }

    const imprimeTicket = () =>{
        imprimeTicketNuevamente(0)
    }

    useEffect(() => {
        const fetchData = async () => {

            const valores = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
                moneda: operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda,
                tipo_movimiento: "D"
            }

            const encryptedData = encryptRequest(valores);

            if(solicitaDotacionFormulario.watch("denominacion") !== '0'){
                setEstadoDotacion(false);
                const denominaciones = await obtieneDenominaciones(encryptedData);
                    if(['USD', 'EUR', 'GBR'].includes(valores.moneda)){
                        for (const key in denominaciones.result_set) {
                            if (denominaciones.result_set.hasOwnProperty(key)) {
                                const denominacionValue = parseFloat(denominaciones.result_set[key].Denominacion);
                                if (denominacionValue === 1) {
                                    delete denominaciones.result_set[key];
                                }
                            }
                        }
                    }else{
                        for (const key in denominaciones.result_set) {
                            if (denominaciones.result_set.hasOwnProperty(key)) {
                                const denominacionValue = parseFloat(denominaciones.result_set[key].Denominacion);
                                if (denominacionValue === 0.05) {
                                    delete denominaciones.result_set[key];
                                }
                            }
                        }
                    }
                solicitaDotacionFormulario.setValue("cantidad",0);
                setDataMoneda(denominaciones.result_set);
                setEstadoDotacion(true);
            }else{
                setEstadoDotacion(false);
            }
        };
        fetchData();
    },[solicitaDotacionFormulario.watch("denominacion")])

    // Se valida lo que se ingresa en el formulario
    const handleDotacionDenominacionForm = solicitaDotacionFormulario.handleSubmit(async(dataFormulario)=>{

        console.log("DATA", dataFormulario);
        console.log("DATA DENO", denominacionD.watch());
    });

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
                    <button className="btn btn-orange" onClick={solicitudDotacionRapida}>
                        <i className="bi bi-currency-exchange me-2"></i>
                        DOTACIÓN RAPIDA
                    </button>
                    <Button variant="success" onClick={solicitaCambio}>
                        <i className="bi bi-cash me-2"></i>
                        SOLICITAR DENOMINACIÓN
                    </Button>
                    <Button variant="primary" onClick={()=> hacerOperacion()} disabled={habilita.entrega || habilita.recibe}>
                        <i className="bi bi-arrow-left-right me-2"></i>
                        FINALIZAR OPERACIÓN
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
            {
                showDotacionRapida && (
                    <ModalGenericTool options={OPTIONS_DOTACION_RAPIDA}>
                        EN DESARROLLO!
                    </ModalGenericTool>
                )
            }
            {
                showCambioDeno && (
                    <ModalGenericTool options={OPTIONS_SOL_DENOMINACION}>

                        <form className="row justify-content-center" onSubmit={handleDotacionDenominacionForm} noValidate>
                                <div className="row">
                                    <div className="col-md-4 mx-auto">
                                        <div className="form-floating mb-3">
                                            <select
                                                {...solicitaDotacionFormulario.register("denominacion",{
                                                    required:{
                                                        value:true,
                                                        message:'Debes de seleccionar al menos una denominación.'
                                                    },
                                                    validate: {
                                                        menorAlDisponible: (value,key) => parseFloat(value.split("-")[1]) >= solicitaDotacionFormulario.watch("cantidad") || "La Cantidad no debe de ser mayor al disponible."
                                                    }
                                                })}
                                                className={`form-select ${!!solicitaDotacionFormulario.formState.errors?.denominacion ? 'invalid-input':''}`}
                                                id="denominacion"
                                                name="denominacion"
                                                aria-label="DENOMINACION"
                                            >
                                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                                {
                                                    dataMoneda?.map((ele) => (
                                                        <option key={ele.Denominacion + '-' + ele["Billetes Disponibles"]}
                                                                value={`${ele.Denominacion}-${ele["Billetes Disponibles"]}`}>
                                                            {ele.Denominacion} - {ele["Billetes Disponibles"]}
                                                            {ele["Billetes Disponibles"] > 1 ? ' disponibles':' disponible'}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                            <label htmlFor="denominacion">DENOMINACION</label>
                                            {
                                                solicitaDotacionFormulario.formState.errors?.denominacion && <div className="invalid-feedback-custom">{solicitaDotacionFormulario.formState.errors?.denominacion.message}</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-4 mx-auto">
                                        <div className="form-floating flex-grow-1">
                                            <input
                                                {...solicitaDotacionFormulario.register("cantidad", {
                                                    required: {
                                                        value: true,
                                                        message: 'El campo Cantidad no puede estar vacío.'
                                                    },
                                                    validate: {
                                                        moneda: (value) => validarNumeros("Cantidad", value),
                                                        mayorACero: value => parseFloat(value) > 0 || "La Cantidad  debe ser mayor a 0"
                                                    }
                                                })}
                                                type="text"
                                                className={`form-control ${!!solicitaDotacionFormulario.formState.errors?.cantidad ? 'is-invalid' : ''}`}
                                                id="cantidad"
                                                name="cantidad"
                                                placeholder="Ingresa la cantidad a cambiar"
                                            />
                                            <label htmlFor="cantidad" className="form-label">CANTIDAD</label>
                                            {
                                                solicitaDotacionFormulario.formState.errors?.cantidad && <div className="invalid-feedback">{solicitaDotacionFormulario.formState.errors?.cantidad.message}</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-4 mx-auto">
                                        <div className="form-floating flex-grow-1">
                                            <input
                                                type="text"
                                                id="total_cambiar"
                                                name="total_cambiar"
                                                className={`form-control mb-1`}
                                                value={parseFloat(solicitaDotacionFormulario.watch("denominacion")) *  parseFloat(solicitaDotacionFormulario.watch("cantidad")) } readOnly
                                            />
                                            <label htmlFor="monto" className="form-label">TOTAL A CAMBIAR ({operacion.tipo_operacion === "1" ? `MXP` : operacion.moneda})</label>
                                        </div>
                                    </div>
                                </div>
                            { estadoDotacion && (<div className="row">
                                <Denominacion type="D"
                                              moneda={operacion.tipo_operacion === "1" ? `MXP` : operacion.moneda}
                                              options={optionsDot}/>
                                <div className="col-md-6 mx-auto">
                                    <button type="button" className="m-2 btn btn-secondary" onClick={OPTIONS_SOL_DENOMINACION.closeModal}>
                                          <span className="ms-2">
                                            <i className="bi bi-arrow-left me-2"></i>
                                            REGRESAR
                                          </span>
                                    </button>

                                    <button type="submit" className="m-2 btn btn-primary">
                                          <span className="me-2">
                                            GUARDAR
                                            <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                                          </span>
                                    </button>
                                </div>
                            </div>)}
                        </form>
                    </ModalGenericTool>
                )
            }
        </>
    );
}