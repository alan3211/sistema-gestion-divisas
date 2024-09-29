import {useContext, useEffect, useState} from 'react';
import {dataG} from "../../../App";
import {
    enviaMensajeDotacionParcial,
    hacerOperacion,
    realizaConversion,
    validaDotParcial
} from "../../../services";
import {ModalConfirm, ModalGenericTool} from "../../commons/modals";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {useCatalogo} from "../../../hook";
import {
    DENOMINACIONES,
    encryptRequest,
    FormatoMoneda,
    formattedDate,
    OPTIONS, redondearNumero,
    validarMonedaUSD
} from "../../../utils";
import {toast} from "react-toastify";
import {LoaderTable} from "../../commons/LoaderTable";
import {getDotaciones} from "../../../services/operacion-caja";
import {TableComponent} from "../../commons/tables";


export const CalculadoraFormComponent = () => {

    const {
        cantidad,
        setCantidad,
        showModal,
        setShowModal,
        showCantidadEntregada,
        setShowCantidadEntregada,
        tipoDivisa,
        setOperacion,
        setContinuaOperacion,
        nuevoUsuario, setNuevoUsuario,
        setShowAltaCliente,
        register,
        handleSubmit,
        errors,
        reset,
        watch,
        busquedaCliente: {setShowCliente},
        datos,setDatos,
    } = useContext(CompraVentaContext);
    const catalogo = useCatalogo([9, 4]);

    const [showModalDotacion,setShowModalDotacion] = useState([{
        show:false,
        mensaje:'',
        monto:0.0,
        moneda:''
    }]);
    const [showEspera, setShowEspera] = useState(false);
    const [showMuestraTabla, setShowMuestraTabla] = useState(false);
    const [ticket, setTicket] = useState('');
    const [data,setData] = useState({});
    const [formData,setFormData] = useState('');
    const [intervalo,setIntervalo] = useState();

    useEffect(() => {
        let intervaloId;
        if (ticket !== '') {
            intervaloId = setInterval(validaEstatusDotacionParcial, 5000);
            setIntervalo(intervaloId);
        }
        return () => clearInterval(intervaloId);
    }, [ticket]);

    /*Cierra el modal cuando se le da en la "x"*/
    const closeModal = () => {
        setShowModal(false);
        setShowModalDotacion({
            show:false,
            mensaje:'',
            monto:0.0,
            moneda:'',
        });
        clearForm();
    }

    /*Muestra la divisa en el input de acuerdo al tipo de operación*/
    const muestraDivisa = (opcion) => {

        if (opcion === 1) {
            return watch("tipo_operacion") === '1' ? watch("moneda") : 'MXP';
        } else {
            return watch("tipo_operacion") === '1' ? 'MXP' : watch("moneda");
        }

    }

    /*Sirve para obtener la divisa*/
    const obtieneDivisa = (tipoDivisa, formValues) => {

        const divisaValor = tipoDivisa.filter(elemento => {
            return elemento.Divisa === formValues["moneda"];
        });

        let valor = null;

        if (divisaValor.length > 0) {
            if (formValues["tipo_operacion"] === "1") {
                valor = divisaValor[0].Compra;
            } else {
                valor = divisaValor[0].Venta;
            }
        }
        console.log(valor);
        return valor;
    }

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

    /*Cuando se le da click en cotizar*/
    const handleSubmitCotizacion = handleSubmit(async (data) => {

        if(data.tipo_operacion === 1){
            data.moneda = 'MXP'
        }

        data.sucursal = parseInt(dataG.sucursal);
        data.cajero = dataG.usuario;
        data["tipo_cambio"] = obtieneDivisa(tipoDivisa, data);
        setDatos(data);
        if (data["tipo_cambio"] === null) {
            toast.error(`No se puede cotizar ya que no existe un tipo de cambio para ${DENOMINACIONES[watch("moneda")]}.`, OPTIONS);
            clearForm();
        } else {
            console.log("OPERACION: ",data)
            setOperacion(data);
            validaCantidadEntregada();
        }
        const encryptData = encryptRequest(data);
        const result = await realizaConversion(encryptData);
        if (result.result_set[0].hasOwnProperty('Mensaje')) {
            setCantidad(0);
            setShowCantidadEntregada(false);
            if (result.result_set[0].Mensaje.includes('Indica')){
                toast.info(result.result_set[0].Mensaje,OPTIONS);
                clearForm();
            }else{
                setShowModalDotacion({
                    show:true,
                    mensaje: result.result_set[0].Mensaje,
                    monto:result.result_set[0].Monto,
                    moneda:result.result_set[0].Moneda,
                });
            }
        }else{
            setCantidad(parseFloat(result.result_set[0].CantidadEntrega));
            data.cantidad_entregar = parseFloat(result.result_set[0].CantidadEntrega);
            setShowCantidadEntregada(true);
        }
    });

    /*Se usa para poder limpiar el formulario*/
    const clearForm = () => {
        reset();
        setShowCantidadEntregada(false);
        setCantidad(0);
        setContinuaOperacion(false); // oculta el modulo de busquedaclientes
        setShowCliente(false); // Oculta el modulo de datos clientes
        setShowAltaCliente(false);
    }

    const preguntaNuevoUsuario = async() => {
        const response = await getOperacion();
        setDatos(response);
        setNuevoUsuario(true);
        setShowModal(false);
    }

    /*Sirve para continuar la operacion si no es nuevo usuario*/
    const continuarOperacion = async() => {
        toast.info("Solicita una identificación oficial vigente",OPTIONS);
        setContinuaOperacion(true);
        setNuevoUsuario(false);
        setShowModal(false);
    }

    const muestraAltaCliente = () =>{
        setShowModal(false);
        setNuevoUsuario(false);
        setShowAltaCliente(true);
    }

    const enviarNotificacion = async() => {

        const valores = {
            sucursal: dataG.sucursal,
            caja: dataG.usuario,
            monto: showModalDotacion.monto,
            moneda: showModalDotacion.moneda,
        }

        const encryptedData = encryptRequest(valores)

        const response = await enviaMensajeDotacionParcial(encryptedData);
        toast.warn(response.result_set[0].Mensaje,OPTIONS);
        console.log("result --> tickets: ",response);
        setTicket(response.result_set[0].Noticket)
        setShowModalDotacion({
            show:false,
            mensaje:'',
            monto:0.0,
            moneda:'',
        });
        setShowEspera(true);
    }

    /*Guarda la preoperacion*/
    const getOperacion = async () => {
        console.log("DATOS! ",datos)
        const operacionEnvia = {
            cliente: '',
            tipo_operacion: datos.tipo_operacion ,
            sucursal: dataG.sucursal || 0,
            nombre_operador: dataG.usuario,
            fecha_operacion: formattedDate,
            hora_operacion: new Date().getHours().toString(),
            monto: parseInt(datos.monto),
            divisa: datos.moneda,
            tipo_cambio: datos.tipo_cambio,
            cantidad_entregar: parseFloat(datos.cantidad_entregar)
        }

        console.log(operacionEnvia);

        const encryptedData = encryptRequest(operacionEnvia);

        return await hacerOperacion(encryptedData);
    }

    /*En esta opcion debo de guardar la preoperacion*/
    const closeModalAndReturn = async() => {
        clearForm();
        closeModal();
        const datos = await getOperacion();
        setDatos(datos);
    }

    /*Valida la cantidad entregada si rebasa el limite diario de una sucursal*/
    const validaCantidadEntregada = () => {
        console.warn("mensaje de cantidad")
        console.warn(cantidad)
        if (parseFloat(cantidad) > dataG.limite_diario) {
            toast.warn(`Esta sucursal solo permite un límite diario de $${dataG.limite_diario} por cliente.`, OPTIONS);
        } else {
            setShowModal(true);
        }
    }

    /* Este metodo regresa el titulo para indicar al cajero que necesita realizar */
    const muestraTitle = () => {
        if(datos.tipo_operacion === '1'){
            return `La cotización fue de ${FormatoMoneda(parseFloat(cantidad),'')} ¿Desea realizar una operación con esta cotización?`
        }else{
            return `La cotización de ${datos.monto} ${datos.moneda} fue por la cantidad de ${FormatoMoneda(parseFloat(cantidad),'')} MXP ¿Desea realizar una operación con esta cotización?`
        }
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

    const refreshQuery = async () =>{
        const data_response = await getDotaciones(formData);
        data_response.headers = [...data_response.headers,'Acciones'];
        setData(data_response);
        setShowEspera(false);
    }


    const optionsCajaTable = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Dotaciones',
        buscar: true,
        paginacion: true,
        disabledColumnsExcel:['Detalle','Acciones'],
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Acciones",tool:"acciones-caja",refresh:refreshQuery},

        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    useEffect(()=>{

        const valores = {
            fecha: formattedDate,
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


    return (
        <>
            <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <select
                                {...register("tipo_operacion", {
                                    required: {
                                        value: true,
                                        message: 'Debes de seleccionar al menos un tipo de operación'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un tipo de operación válido.';
                                    }
                                })}
                                className={`form-select ${!!errors?.tipo_operacion ? 'invalid-input' : ''}`}
                                id="tipo_operacion"
                                name="tipo_operacion"
                                aria-label="Tipo de Operación"
                            >
                                <option value="">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[0]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="tipo_operacion">TIPO DE OPERACIÓN</label>
                            {
                                errors?.tipo_operacion &&
                                <div className="invalid-feedback-custom">{errors?.tipo_operacion.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <select
                                {...register("moneda", {
                                    required: {
                                        value: true,
                                        message: 'Debes de seleccionar al menos una moneda.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar una moneda válida.';
                                    }
                                })}
                                className={`form-select ${!!errors?.moneda ? 'invalid-input' : ''}`}
                                id="moneda"
                                name="moneda"
                                aria-label="Moneda"
                            >
                                <option value="">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[1]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="moneda">DIVISA</label>
                            {
                                errors?.moneda &&
                                <div className="invalid-feedback-custom">{errors?.moneda.message}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3 d-flex">
                        <div className="form-floating flex-grow-1">
                            <input
                                {...register("monto", {
                                    required: {
                                        value: true,
                                        message: 'El campo Cantidad a Cotizar no puede estar vacío.'
                                    },
                                    validate: {
                                        moneda: (value) => validarMonedaUSD("Cantidad a Cotizar", value),
                                        mayorACero: value => parseFloat(value) > 0 || "La Cantidad a Cotizar debe ser mayor a 0"
                                    }
                                })}
                                type="text"
                                className={`form-control ${!!errors?.monto ? 'is-invalid' : ''}`}
                                id="monto"
                                name="monto"
                                placeholder="Ingresa la cantidad a cotizar por el usuario"
                                autoComplete="off"
                            />
                            <label htmlFor="monto" className="form-label">CANTIDAD A COTIZAR <i>({watch("moneda") === '0' ?'USD':watch("moneda")})</i></label>
                            {
                                errors?.monto && <div className="invalid-feedback">{errors?.monto.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-6 mb-3 d-flex">
                        {showCantidadEntregada &&
                                    <div className="form-floating flex-grow-1">
                                        <input type="text"
                                               className={`form-control mb-1`}
                                               id="floatingCE"
                                               value={cantidad}
                                               readOnly
                                               autoComplete="off"
                                        />
                                        <label htmlFor="floatingCE">CANTIDAD A {watch("tipo_operacion") === '1' ? 'ENTREGAR':'RECIBIR'} <i>({datos.tipo_operacion === '1' ? muestraDivisa(2):'MXP'})</i></label>
                            </div>
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="button" onClick={clearForm} className="btn btn-secondary me-2">
                        <i className="bi bi-file-earmark-plus"></i> <strong>NUEVA COTIZACIÓN</strong>
                    </button>
                    <button
                        type="button"
                        className="btn btn-success d-flex p-3"
                        onClick={handleSubmitCotizacion}
                        disabled={parseFloat(cantidad) > dataG.limite_diario}
                    >
                        <i className="bi bi-cash-coin me-2"></i>
                        <strong>COTIZAR</strong>
                    </button>
                </div>
            </form>

            {
                cantidad !== 0 && (<ModalConfirm title={muestraTitle()}
                          showModal={showModal}
                          closeModal={closeModal}
                          hacerOperacion={preguntaNuevoUsuario}
                          closeModalAndReturn={closeModalAndReturn}
                          icon="bi bi-exclamation-triangle-fill text-warning m-2"
                />)
            }
            {
               nuevoUsuario && (<ModalConfirm title={`¿Se encuentra registrado este usuario en el sistema?`}
                                                 showModal={nuevoUsuario}
                                                 closeModal={()=> setNuevoUsuario(false)}
                                                 hacerOperacion={continuarOperacion}
                                                 closeModalAndReturn={muestraAltaCliente}
                                                 icon="bi bi-exclamation-triangle-fill text-warning m-2"
                />)
            }
            {
                showModalDotacion.show && (
                    <ModalConfirm title={showModalDotacion.mensaje}
                                  showModal={showModalDotacion.show}
                                  closeModal={closeModal}
                                  hacerOperacion={enviarNotificacion}
                                  closeModalAndReturn={closeModalAndReturn}
                                  icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }
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
        </>
    );
};
