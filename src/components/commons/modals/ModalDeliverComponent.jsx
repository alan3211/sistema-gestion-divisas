import {Button, Modal} from "react-bootstrap";
import {useContext, useEffect, useMemo, useState} from "react";
import {dataG} from "../../../App";
import {guardaConfirmacionFactura, obtieneDenominaciones, realizarOperacion, validaDotParcial} from "../../../services";
import {ModalCambio} from "./ModalCambio";
import {
    eliminarDenominacionesConCantidadCero, encryptRequest, formattedDate, formattedDateF, formattedDateWS,
    getDenominacion,
    obtenerObjetoDenominaciones, opciones, OPTIONS, redondearNumero, validarMoneda, validarNumeros
} from "../../../utils";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Denominacion} from "../../operacion/denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {usePrinter,useMovimientosDotaciones} from "../../../hook/";
import {ModalTicket} from "./ModalTicket";
import {ModalGenericPLDTool, ModalGenericTool} from "./ModalTools";
import {useForm} from "react-hook-form";
import {realizarOperacionSucursal, realizarSolicitudCambio} from "../../../services/operacion-sucursal";
import {ModalLoading} from "./ModalLoading";
import {TableComponent} from "../tables";
import {LoaderTable} from "../LoaderTable";
import {getDotaciones} from "../../../services/operacion-caja";
import {toastTheme} from "flowbite-react/lib/esm/components/Toast/theme";

export const ModalDeliverComponent = ({configuration}) =>{
    const {showCustomModal,setShowCustomModal,operacion,datos} = configuration;
    const [showCambio,setShowCambio] = useState(false);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });
    const [redondeo,setRedondeo] = useState(0.0);
    const navigator = useNavigate();
    const [guarda,setGuarda] = useState(false);
    const [preguntaRedondeo,setPreguntaRedondeo] = useState(false);
    const [showConfirmaCancelacion,setShowConfirmaCancelacion] = useState(false);
    const {
        denominacionR,
        denominacionE,
        denominacionD,
    } = useContext(DenominacionContext);
    const {imprimir,imprimeTicketNuevamente} = usePrinter({"No Usuario": datos.Cliente,
        "No Ticket": datos.ticket});
    const [showModal,setShowModal] = useState(false)
    const [showModalFactura,setShowModalFactura] = useState(false)

    const solicitaDotacionFormulario =  useForm();
    const solicitaDotacionRapidaFormulario =  useForm();
    const [estadoDotacion,setEstadoDotacion] = useState(false);
    const [operacionSinFinalizar,setOperacionSinFinalizar] = useState('');
    const {solicitudDotacionRapida, showDotacionRapida,setShowDotacionRapida,
        OPTIONS_DOTACION_RAPIDA,} =  useMovimientosDotaciones(
            {
                solicitaDotacionFormulario,
                solicitaDotacionRapidaFormulario,
                setEstadoDotacion,
            });
    const [showEspera, setShowEspera] = useState(false);
    const [showMuestraTabla, setShowMuestraTabla] = useState(false);
    const [ticket, setTicket] = useState('');
    const [data,setData] = useState({});
    const [formData,setFormData] = useState('');
    const [intervalo,setIntervalo] = useState();


    const OPTIONS_PREGUNTA_REDONDEO = {
        size: 'xl',
        showModal: () => setPreguntaRedondeo(true),
        closeModal: () => {
            setPreguntaRedondeo(false)
            setGuarda(false);
        },
        waiting:true,
        icon:'bi bi-currency-exchange text-warning me-2',
        title:'Diferencia en denominación a entregar',
        subtitle:`Se detecto una diferencia al monto a entregar por ${parseFloat(redondeo).toFixed(2)}. Confirma si corresponde a un redondeo.`
    }


    //Muestra el título correcto
    const titulo = `Operación ${operacion.tipo_operacion === "1" ? 'Compra': 'Venta'}`;

    // Calcula el valor del monto de la parte decimal con 2 digitos
    const calculaValorMonto = useMemo(() => {
        if (operacion.tipo_operacion === '2') {
            return parseFloat(operacion.cantidad_entregar);
        }
        return operacion.monto;
    }, [operacion.cantidad_entregar, operacion.tipo_cambio, operacion.monto, operacion.tipo_operacion]);

    // Muestra la divisa correspondiente
    const muestraDivisa = () => operacion.tipo_operacion === "1" ? operacion.moneda : 'MXP';

    //Cierra el modal
    const closeCustomModal = () => setShowCustomModal(false);

    const hacerOperacion = async () => {
        setGuarda(true);
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

        console.log("DATOS: ",datos);

        const values = {
            cliente: datos.Cliente,
            ticket: datos.ticket,
            divisa: muestraDivisa(),
            cantidad_entregar: parseFloat(operacion.cantidad_entregar),
            monto: parseFloat(operacion.monto),
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            traspaso: '',
            diferencia:0.0,
            totalRecibido:parseFloat(denominacionR.calculateGrandTotal()),
            //cambio:parseFloat(denominacionR.calculateGrandTotal() - parseFloat(calculaValorMonto)) - redondeo,
            cambio:parseFloat(denominacionR.calculateGrandTotal() - parseFloat(calculaValorMonto)),
            denominacion:[
                obtenerObjetoDenominaciones(formValuesR),
                obtenerObjetoDenominaciones(formValuesE),
            ]
        }

        console.log("FINALIZA OPERACION --- values");
        console.log(values);

        console.log(`Se envia el redondeo: ${redondeo}`)

        values.redondeo = redondeo;
        const encryptedData = encryptRequest(values);
        setOperacionSinFinalizar(encryptedData);

        if(redondeo > -0.30 && redondeo < 0.30){
            if(redondeo !== 0.00){
                setPreguntaRedondeo(true);
            }else{
                let cambioFinal = parseFloat(denominacionR.calculateGrandTotal()) - parseFloat(calculaValorMonto);
                if (cambioFinal > 0) {
                    setShowCambio(true);
                }else {
                    setPreguntaRedondeo(false);
                    const response = await realizarOperacion(encryptedData);
                    console.log(response);
                    if (response.mensaje === '') {
                        setShowModalFactura(true);
                    } else {
                        toast.error(response.mensaje, OPTIONS);
                        setShowModalFactura(false);
                    }
                }
                setGuarda(false);
            }
        }
    }

    const enviaFinalOperacion = async() => {
        setPreguntaRedondeo(false);
        let cambioFinal = parseFloat(denominacionR.calculateGrandTotal()) - parseFloat(calculaValorMonto);
        if (cambioFinal > 0) {
            setShowCambio(true);
        }else {
            const response = await realizarOperacion(operacionSinFinalizar);
            console.log(response);
            if(response.mensaje === ''){
                setShowModalFactura(true);
            }else{
                toast.error(response.mensaje, OPTIONS);
                setShowModalFactura(false);
            }
            setPreguntaRedondeo(false);
        }
        setGuarda(false);
    }

    const options = {
        title: `Recibido del usuario (${muestraDivisa()})`,
        importe: operacion.tipo_operacion !== "1" ? operacion.cantidad_entregar:operacion.monto,
        calculaValorMonto:parseFloat(calculaValorMonto),
        habilita,
        setHabilita,
        tipo: 'R',
    }

    const optionsE = {
        title: `Entregado al usuario (${operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})`,
        importe:operacion.tipo_operacion === "1" ? operacion.cantidad_entregar:operacion.monto,
        calculaValorMonto:parseFloat(calculaValorMonto),
        habilita,
        setHabilita,
        redondeo,
        setRedondeo,
        tipo: 'E',
        reRender: !showEspera ,
    }

    const optionsDotRap = {
        title: `Solicitando dotación parcial en (${operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda})`,
        importe:operacion.tipo_operacion !== "1" ? parseFloat(operacion.monto):operacion.cantidad_entregar,
        calculaValorMonto:parseFloat(calculaValorMonto),
        habilita,
        setHabilita,
        tipo: 'SD',
    }

    const imprimeTicket = () =>{
        imprimeTicketNuevamente(0)
    }

    // Sección de dotación parcial
    const handleDotacionRapida = async()=>{
        const moneda = operacion.tipo_operacion === "1" ? `MXP`:operacion.moneda;

        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        const dataFormulario = {};

        dataFormulario.operacion = 'Solicitud Dotacion Parcial';
        dataFormulario.usuario = dataG.usuario;
        dataFormulario.sucursal = dataG.sucursal;
        dataFormulario.ticket = `DOTRAP${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        dataFormulario.noCliente='0';
        dataFormulario.traspaso='';
        dataFormulario.moneda=moneda;
        dataFormulario.monto= parseFloat(denominacionD.calculateGrandTotal());

        let denominacionesDotacion = denominacionD.getValues();
        const formValuesD = getDenominacion(moneda,denominacionesDotacion)
        eliminarDenominacionesConCantidadCero(formValuesD);
        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.moneda = moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'Solicitud Dotacion Parcial';

        dataFormulario.denominacion = [
            denominaciones,
        ]

        console.log("DATA FORM")
        console.log(dataFormulario)
        const encryptedData = encryptRequest(dataFormulario);
        setTicket(dataFormulario.ticket)
        await realizarOperacionSucursal(encryptedData);

        toast.warn('Se realizo la notificación de tu solicitud al supervisor.',OPTIONS);
        setShowEspera(true);
    }

    const optionsLoad = {
        showModal:guarda,
        closeCustomModal: ()=> setGuarda(false),
        title:'Finalizando Operación...'
    }

    const guardaFactura = async ()=> {

        const values = {
            ticket: datos.ticket,
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

    const cancelarOperacion = ()=> {
        setShowConfirmaCancelacion(false);
        toast.success('Se ha cancelado la operación correctamente.',OPTIONS);
        navigator("/inicio");
    }

    useEffect(() => {
        let intervaloId;
        if (ticket !== '') {
            intervaloId = setInterval(validaEstatusDotacionParcial, 5000);
            setIntervalo(intervaloId);
        }
        return () => clearInterval(intervaloId);
    }, [ticket]);

    useEffect(()=>{

        const valores = {
            fecha: formattedDateF,
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
        }
        const encryptedData = encryptRequest(valores);
        setFormData(encryptedData);

        const getConsultaDotaciones = async () =>{
            const data_response = await getDotaciones(encryptedData);
            data_response.headers = [...data_response.headers,'Acciones'];
            setData(data_response);
        }
        getConsultaDotaciones();
    },[showMuestraTabla]);

    /*Validar el intervalo para saber si ya cambio el estatus*/
    const validaEstatusDotacionParcial = async () => {
        const valores = {
            opcion: 2,
            ticket: ticket,
        }
        const response = await validaDotParcial(encryptRequest(valores));
        console.log("RESPUESTA: ", response);
        if (response === 'Pendiente') {
            setShowMuestraTabla(true);
            setTicket("");
            clearInterval(intervalo);
        } else if(response === "Solicitado") {
            setShowMuestraTabla(false);
        } else if(response === "Cancelada"){
            setShowMuestraTabla(false);
            setShowEspera(false);
            setTicket("");
            clearInterval(intervalo);
            toast.info("El supervisor rechazo la dotación parcial por falta de fondos.",OPTIONS)
        }else{
            setShowMuestraTabla(false);
        }
    }

    const refreshQuery = async () =>{
        const data_response = await getDotaciones(formData);
        data_response.headers = [...data_response.headers,'Acciones'];
        setData(data_response);
        setShowEspera(false);
        setShowDotacionRapida(false);

    }


    const optionsCajaTable = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Dotaciones',
        buscar: true,
        paginacion: true,
        disabledColumns:['Detalle'],
        disabledColumnsExcel:['Detalle','Acciones'],
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Acciones",tool:"acciones-caja",refresh:refreshQuery},

        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    const optionsModal = {
        size:'xl',
        showModal: showEspera,
        closeModal: () => setShowEspera(false),
        title: 'Solicitud de Dotación Parcial',
        icon: 'bi bi-cash m-2 text-blue',
        subtitle: '',
        waiting:showEspera
    };


    return(
        <>
            <Modal fullscreen  show={showCustomModal} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>
                        <div className="d-flex align-items-center justify-content-end w-100">
                            <h5 className="text-blue m-0">
                                <i className="bi bi-currency-exchange m-2"></i>
                                {titulo}
                            </h5>
                        </div>
                    </Modal.Title>
                    <button type="button" className="btn-close" onClick={closeCustomModal} aria-label="Close"></button>
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
                                    autoComplete="off"
                                />
                                <label htmlFor="monto" className="form-label">IMPORTE <i>({operacion.moneda})</i></label>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3 d-flex">
                            <div className="form-floating flex-grow-1">
                                <input
                                    type="text"
                                    id="monto"
                                    name="monto"
                                    className={`form-control mb-1`}
                                    placeholder="Ingresa la cantidad a por el usuario"
                                    value={operacion.tipo_operacion !== "1" ? operacion.cantidad_entregar:operacion.monto} readOnly
                                    autoComplete="off"
                                />
                                <label htmlFor="monto" className="form-label">CANTIDAD A RECIBIR <i>({operacion.tipo_operacion === '1' ? operacion.moneda:'MXP'})</i></label>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3 d-flex">
                            <div className="form-floating flex-grow-1">
                                <input type="text"
                                       className={`form-control mb-1`}
                                       id="floatingCE"
                                       value={operacion.tipo_operacion === "1" ? operacion.cantidad_entregar:operacion.monto}
                                       readOnly
                                       autoComplete="off"
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
                    <button className="btn btn-danger" onClick={()=> setShowConfirmaCancelacion(true)}>
                        <i className="bi bi-x me-2"></i>
                        CANCELAR OPERACIÓN
                    </button>
                    <button className="btn btn-orange" onClick={solicitudDotacionRapida}>
                        <i className="bi bi-currency-exchange me-2"></i>
                        DOTACIÓN PARCIAL
                    </button>
                    <Button variant="primary" onClick={()=> hacerOperacion()} disabled={habilita.entrega || habilita.recibe}>
                        <i className="bi bi-arrow-left-right me-2"></i>
                        FINALIZAR OPERACIÓN
                    </Button>
                </Modal.Footer>
            </Modal>

            {
                showEspera && (
                    <ModalGenericTool options={optionsModal}>
                        {showMuestraTabla
                            ? <TableComponent data={data} options={optionsCajaTable} />
                            : <LoaderTable title="Esperando respuesta del supervisor..."/>
                        }
                    </ModalGenericTool>
                )
            }

            {
                guarda && (
                    <ModalLoading options={optionsLoad}/>
                )
            }

            {
                showCambio
                    &&
                    <ModalCambio
                        cambio={(parseFloat(denominacionR.calculateGrandTotal()) - parseFloat(calculaValorMonto))}
                        showModalCambio={showCambio}
                        setShowModalCambio={setShowCambio}
                        operacion={operacion}
                        data={datos}
                        habilita={habilita}
                        setHabilita={setHabilita}
                        operacionConCambio={operacionSinFinalizar}
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
                showConfirmaCancelacion && (
                    <ModalTicket title="¿Deseas cancelar la operación?"
                                 showModal={showConfirmaCancelacion}
                                 closeModalAndReturn={()=>{
                                     setShowConfirmaCancelacion(false);
                                 }}
                                 hacerOperacion={cancelarOperacion}
                                 icon="bi bi-exclamation-triangle-fill text-danger m-2"/>
                )
            }
            {
                showDotacionRapida && (
                    <ModalGenericTool options={OPTIONS_DOTACION_RAPIDA}>
                        { estadoDotacion && (<div className="row">
                            <Denominacion type="SD"
                                          moneda={operacion.tipo_operacion === "1" ? `MXP` : operacion.moneda}
                                          options={optionsDotRap}/>
                            <div className="col-md-3 mx-auto">
                                <button type="button" className="m-2 btn btn-secondary" onClick={OPTIONS_DOTACION_RAPIDA.closeModal}>
                                      <span className="ms-2">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        REGRESAR
                                      </span>
                                </button>

                                <button type="button" className="m-2 btn btn-primary" onClick={handleDotacionRapida}
                                disabled={parseFloat(denominacionD.calculateGrandTotal()) === 0.0}>
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
                preguntaRedondeo && (
                    <ModalGenericPLDTool options={OPTIONS_PREGUNTA_REDONDEO}>
                            <div className="col-md-6 mx-auto">
                                <button type="button" className="m-2 btn btn-secondary" onClick={OPTIONS_PREGUNTA_REDONDEO.closeModal}>
                                      <span className="ms-2">
                                        <i className="bi bi-x-circle me-2"></i>
                                        NO
                                      </span>
                                </button>

                                <button type="button" className="m-2 btn btn-primary" onClick={enviaFinalOperacion}>
                                      <span className="ms-2">
                                        SI
                                        <span className="bi-check-circle ms-2" role="status" aria-hidden="true"></span>
                                      </span>
                                </button>
                            </div>
                    </ModalGenericPLDTool>
                )
            }
        </>
    );
}