import {Button, Modal} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest, formattedDateWS,
    getDenominacion,
    obtenerObjetoDenominaciones, opciones, OPTIONS, redondearNumero, validarNumeros
} from "../../../utils";
import {dataG} from "../../../App";
import {guardaConfirmacionFactura, obtieneDenominaciones, realizarOperacion} from "../../../services";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Denominacion} from "../../operacion/denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {usePrinter} from "../../../hook";
import {ModalTicket} from "./ModalTicket";
import {ModalGenericTool} from "./ModalTools";
import {ModalLoading} from "./ModalLoading";
import {realizarOperacionSucursal, realizarSolicitudCambio} from "../../../services/operacion-sucursal";
import {useMovimientosDotaciones} from "../../../hook";
import {useForm} from "react-hook-form";


export const ModalCambio = ({cambio,showModalCambio,setShowModalCambio,operacion,data,habilita,setHabilita}) => {

    const navigator = useNavigate();
    const [guarda,setGuarda] = useState(false);
    const {denominacionC,denominacionD} = useContext(DenominacionContext);
    const {imprimir,imprimeTicketNuevamente} = usePrinter({"No Usuario": data.Cliente,
        "No Ticket": data.ticket});
    const [showModal,setShowModal] = useState(false)
    const solicitaDotacionFormulario =  useForm();
    const solicitaDotacionRapidaFormulario =  useForm();
    const [dataMoneda,setDataMoneda] = useState([]);
    const [estadoDotacion,setEstadoDotacion] = useState(false);
    const [showModalFactura,setShowModalFactura] = useState(false)
    const {solicitaCambio,solicitudDotacionRapida, showDotacionRapida, showCambioDeno,
        OPTIONS_DOTACION_RAPIDA,
        OPTIONS_SOL_DENOMINACION} =  useMovimientosDotaciones(
        {
            solicitaDotacionFormulario,
            solicitaDotacionRapidaFormulario,
            setEstadoDotacion,
        });

    const options = {
        title: '',
        importe: redondearNumero(cambio),
        habilita,
        setHabilita,
        reRender: guarda,
    }

    useEffect(() => {
        const fetchData = async () => {

            const valores = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
                moneda: operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda,
                tipo_movimiento: "D"
            }

            const encryptedData = encryptRequest(valores);

            if(solicitaDotacionFormulario.watch("denominacion_cambio") !== '0'){
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
    },[solicitaDotacionFormulario.watch("denominacion_cambio")])

    // Se valida lo que se ingresa en el formulario
    const handleDotacionDenominacionForm = solicitaDotacionFormulario.handleSubmit(async(dataFormulario)=>{
        setGuarda(true);
        const moneda = operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda;

        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        dataFormulario.denominacion_cambio =  dataFormulario.denominacion_cambio.split("-")[0];
        dataFormulario.operacionEntrega = 'ENTREGA CAMBIO';
        dataFormulario.operacionRecibe = 'RECIBE CAMBIO';
        dataFormulario.usuario = dataG.usuario;
        dataFormulario.sucursal = dataG.sucursal;
        dataFormulario.ticketEntrega = `ENTCAM${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        dataFormulario.ticketRecibe = `RECCAM${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        dataFormulario.noCliente='0';
        dataFormulario.traspaso='';

        let denominacionesDotacion = denominacionD.getValues();
        const formValuesD = getDenominacion(moneda,denominacionesDotacion)
        eliminarDenominacionesConCantidadCero(formValuesD);
        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = '0';

        dataFormulario.denominacion = [
            denominaciones,
        ]

        const encryptedData = encryptRequest(dataFormulario);

        const resultado = await realizarSolicitudCambio(encryptedData);

        if(resultado){
            toast.success(`Se ha realizado la solicitud del cambio exitosamente.`,OPTIONS);
            OPTIONS_SOL_DENOMINACION.closeModal();
            setGuarda(false);
            solicitaDotacionFormulario.reset();
            denominacionD.reset();
        }

    });

    // Sección de dotación Rapida
    const handleDotacionRapida = async()=>{
        setGuarda(true);
        const moneda = operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda;

        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        const dataFormulario = {};

        dataFormulario.operacion = 'DOTACION RAPIDA';
        dataFormulario.usuario = dataG.usuario;
        dataFormulario.sucursal = dataG.sucursal;
        dataFormulario.ticket = `DOTRAP${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        dataFormulario.noCliente='0';
        dataFormulario.traspaso='';
        dataFormulario.moneda=moneda;
        dataFormulario.monto= denominacionD.calculateGrandTotal();

        let denominacionesDotacion = denominacionD.getValues();
        const formValuesD = getDenominacion(moneda,denominacionesDotacion)
        eliminarDenominacionesConCantidadCero(formValuesD);
        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'DOTACION RAPIDA';

        dataFormulario.denominacion = [
            denominaciones,
        ]

        console.log("DATA FORM")
        console.log(dataFormulario)
        const encryptedData = encryptRequest(dataFormulario);

        const resultado = await realizarOperacionSucursal(encryptedData);

        if(resultado){
            toast.success(`Se ha realizado la dotación rápida exitosamente.`,OPTIONS);
            OPTIONS_DOTACION_RAPIDA.closeModal();
            setGuarda(false);
            denominacionD.reset();
        }else{
            toast.error(`Hubo un problema al realizar la solicitud rápida.`,OPTIONS);
        }

    }

    const optionsLoad = {
        showModal:guarda,
        closeCustomModal: ()=> setGuarda(false),
        title:'Guardando...'
    }

    const optionsDot = {
        title: `Solicitando cambio en (${operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda})`,
        importe: solicitaDotacionFormulario.watch("denominacion_cambio") !== '0' ? parseFloat(solicitaDotacionFormulario.watch("denominacion_cambio")):0,
        importeFinal: solicitaDotacionFormulario.watch("denominacion_cambio") !== '0' ?(parseFloat(solicitaDotacionFormulario.watch("denominacion_cambio")) *  parseFloat(solicitaDotacionFormulario.watch("cantidad"))):0,
        habilita,
        setHabilita,
        tipo: 'SD',
    }

    const optionsDotRap = {
        title: `Solicitando dotación rápida en (${operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda})`,
        habilita,
        setHabilita,
        tipo: 'SD',
    }

    const guardarCambio = async() => {

        console.log("data del cambio");
        console.log(data);

        let denominacionesCambio = denominacionC.getValues();

        const formValuesC = getDenominacion(operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda,denominacionesCambio);

        if(operacion.tipo_operacion === '1') {
            formValuesC.tipoOperacion = 'COMPRA';
        }else{
            formValuesC.tipoOperacion = 'VENTA';
        }

        formValuesC.divisa = operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda;
        formValuesC.movimiento = 'CAMBIO AL USUARIO';

        eliminarDenominacionesConCantidadCero(formValuesC);

        console.log("CAMBIO!: ",cambio);

        const values = {
            cliente: data.Cliente,
            ticket: data.ticket,
            cantidad_entregar: parseFloat(cambio),
            monto: 0.0,
            divisa:operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda,
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia: 0.0,
            denominacion:[
                obtenerObjetoDenominaciones(formValuesC),
            ]
        }
        console.log("VALUES DEL CAMBIO: ",values);
        const encryptedData = encryptRequest(values);

        const resultado = await realizarOperacion(encryptedData);

        // Validar si tenemos que darle cambio
        if(resultado){
            setShowModalFactura(true);
        }
    }

    const imprimeTicket = () =>{
        imprimeTicketNuevamente(0)
    }

    const guardaFactura = async ()=> {

        const values = {
            ticket: data.ticket,
            resguardo: 'SI'
        }

        const encryptedData =  encryptRequest(values);

        const response = await guardaConfirmacionFactura(encryptedData)

        if(response.total_rows === 0){
            toast.error('Hubo un problema al resguardar la factura',OPTIONS);
        }else{
            imprimir(0);
            setShowModalFactura(false)
            setShowModal(true)
        }

    }

    return(
        <>
            <Modal centered size="lg" show={showModalCambio}>
                <Modal.Header>
                    <Modal.Title>
                        <h5 className="text-blue">
                            <i className="bx bx-money m-2"></i>
                            Entrega de Cambio ({operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda})
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
                                       autoComplete="off"
                                />
                                <label htmlFor="floatingCE">CANTIDAD A ENTREGAR <i>({operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda})</i></label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <Denominacion type="C" moneda={operacion.tipo_operacion !== "1" ? `MXP`:operacion.moneda} options={options}/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-orange" onClick={solicitudDotacionRapida}>
                        <i className="bi bi-currency-exchange me-2"></i>
                        DOTACIÓN PARCIAL
                    </button>
                    {/*<Button variant="success" onClick={solicitaCambio}>
                        <i className="bi bi-cash me-2"></i>
                        SOLICITAR DENOMINACIÓN
                    </Button>*/}
                    <Button variant="primary" disabled={redondearNumero(denominacionC.calculateGrandTotal) != redondearNumero(cambio)} onClick={guardarCambio}>
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
                                      toast.success('Se ha entregado el cambio correspondiente.', OPTIONS);
                                      setShowModal(false)
                                      navigator('/inicio')
                                  }}
                                  icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }
            {
                showModalFactura && (
                    <ModalTicket title="¿El usuario requiere factura?"
                                 showModal={showModalFactura}
                                 closeModalAndReturn={()=>{
                                     imprimir(0);
                                     setShowModal(true)
                                 }}
                                 hacerOperacion={guardaFactura}
                                 icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }
            {
                showDotacionRapida && (
                    <ModalGenericTool options={OPTIONS_DOTACION_RAPIDA}>
                        { estadoDotacion && (<div className="row">
                            <Denominacion type="SD"
                                          moneda={operacion.tipo_operacion !== "1" ? `MXP` : operacion.moneda}
                                          options={optionsDotRap}/>
                            <div className="col-md-6 mx-auto">
                                <button type="button" className="m-2 btn btn-secondary" onClick={OPTIONS_DOTACION_RAPIDA.closeModal}>
                                      <span className="ms-2">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        REGRESAR
                                      </span>
                                </button>

                                <button type="button" className="m-2 btn btn-primary" onClick={handleDotacionRapida}
                                        disabled={denominacionD.calculateGrandTotal() === 0}>
                                      <span className="me-2">
                                        GUARDAR
                                        <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                                      </span>
                                </button>
                            </div>
                        </div>)}
                    </ModalGenericTool>
                )
            }
            {
                showCambioDeno && (
                    <ModalGenericTool options={OPTIONS_SOL_DENOMINACION}>

                        <div className="row justify-content-center">
                            <div className="row">
                                <div className="col-md-4 mx-auto">
                                    <div className="form-floating mb-3">
                                        <select
                                            {...solicitaDotacionFormulario.register("denominacion_cambio",{
                                                required:{
                                                    value:true,
                                                    message:'Debes de seleccionar al menos una denominación.'
                                                },
                                                validate: {
                                                    menorAlDisponible: (value,key) => parseFloat(value.split("-")[1]) >= solicitaDotacionFormulario.watch("cantidad") || "La Cantidad no debe de ser mayor al disponible."
                                                }
                                            })}
                                            className={`form-select ${!!solicitaDotacionFormulario.formState.errors?.denominacion_cambio ? 'invalid-input':''}`}
                                            id="denominacion_cambio"
                                            name="denominacion_cambio"
                                            aria-label="DENOMINACION"
                                        >
                                            <option value="">SELECCIONA UNA OPCIÓN</option>
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
                                            solicitaDotacionFormulario.formState.errors?.denominacion_cambio && <div className="invalid-feedback-custom">{solicitaDotacionFormulario.formState.errors?.denominacion_cambio.message}</div>
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
                                            autoComplete="off"
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
                                            value={parseFloat(solicitaDotacionFormulario.watch("denominacion_cambio")) *  parseFloat(solicitaDotacionFormulario.watch("cantidad") || 0) } readOnly
                                            autoComplete="off"
                                        />
                                        <label htmlFor="monto" className="form-label">TOTAL A CAMBIAR ({operacion.tipo_operacion !== "1" ? `MXP` : operacion.moneda})</label>
                                    </div>
                                </div>
                            </div>
                            { estadoDotacion && (<div className="row">
                                <Denominacion type="SD"
                                              moneda={operacion.tipo_operacion !== "1" ? `MXP` : operacion.moneda}
                                              options={optionsDot}/>
                                <div className="col-md-6 mx-auto">
                                    <button type="button" className="m-2 btn btn-secondary" onClick={OPTIONS_SOL_DENOMINACION.closeModal}>
                                          <span className="ms-2">
                                            <i className="bi bi-arrow-left me-2"></i>
                                            REGRESAR
                                          </span>
                                    </button>

                                    <button type="button" className="m-2 btn btn-primary"
                                            onClick={handleDotacionDenominacionForm}
                                            disabled={!parseInt(solicitaDotacionFormulario.watch("cantidad")) > 0
                                                || (parseFloat(solicitaDotacionFormulario.watch("denominacion_cambio").split("-")[0]) *  parseFloat(solicitaDotacionFormulario.watch("cantidad"))) !== denominacionD.calculateGrandTotal()}
                                    >
                                          <span className="me-2">
                                            GUARDAR
                                            <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                                          </span>
                                    </button>
                                </div>
                            </div>)}
                        </div>
                        {
                            guarda && <ModalLoading options={optionsLoad} />
                        }
                    </ModalGenericTool>
                )
            }
        </>
    );
}