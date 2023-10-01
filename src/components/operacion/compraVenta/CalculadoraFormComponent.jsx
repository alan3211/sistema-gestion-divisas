import {useContext, useState} from 'react';
import {dataG} from "../../../App";
import {hacerOperacion, realizaConversion} from "../../../services";
import {ModalConfirm} from "../../commons/modals";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {useCatalogo} from "../../../hook/useCatalogo";
import {
    DENOMINACIONES,
    encryptRequest,
    FormatoMoneda,
    formattedDate,
    hora,
    OPTIONS,
    validarMoneda
} from "../../../utils";
import {toast} from "react-toastify";
import {Overlay} from "../../commons/toast/Overlay";

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
        register,
        handleSubmit,
        errors,
        reset,
        watch,
        busquedaCliente: {setShowCliente},
        datos,setDatos,
    } = useContext(CompraVentaContext);
    const catalogo = useCatalogo([9, 4]);
    const [showOverlay, setShowOverlay] = useState(false);

    /*Cierra el modal cuando se le da en la "x"*/
    const closeModal = () => {
        setShowModal(false);
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
            return elemento.divisa === formValues["moneda"];
        });

        let valor = null;

        if (divisaValor.length > 0) {
            if (formValues["tipo_operacion"] === "1") {
                valor = divisaValor[0].compra;
            } else {
                valor = divisaValor[0].venta;
            }
        }
        return valor;
    }

    /*Cuando se le da click en cotizar*/
    const handleSubmitCotizacion = handleSubmit(async (data) => {
        data.sucursal = parseInt(dataG.sucursal);
        data.cajero = dataG.usuario;
        const encryptData = encryptRequest(data);
        const result = await realizaConversion(encryptData);
        if (result.result_set[0].hasOwnProperty('Mensaje')) {
            setCantidad(0);
            setShowCantidadEntregada(false);
            setShowOverlay(true);
            toast.error(result.result_set[0].Mensaje,{
                position: "top-center",
                closeButton: true,
                closeOnClick:false,
                className: 'overlay-toast',
                draggable:false,
                autoClose:false,
                theme: "colored",
                onClose: () => {
                    setShowOverlay(false); // Oculta el fondo de superposición cuando se cierra el toast
                },
            });
            clearForm();
        }else{
            setCantidad(parseFloat(result.result_set[0].CantidadEntrega));
            data.cantidad_entregar = parseFloat(result.result_set[0].CantidadEntrega);
            setShowCantidadEntregada(true);
        }
        data["tipo_cambio"] = obtieneDivisa(tipoDivisa, data);
        setDatos(data);
        console.log("DATA DEL FORM: ",data)
        console.log("DATA DEL STATE: ",datos)
        if (data["tipo_cambio"] === null) {
            toast.error(`No se puede cotizar ya que no existe un tipo de cambio para ${DENOMINACIONES[watch("moneda")]}.`, OPTIONS);
            clearForm();
        } else {
            setOperacion(data);
            validaCantidadEntregada();
        }
    });

    /*Se usa para poder limpiar el formulario*/
    const clearForm = () => {
        reset();
        setShowCantidadEntregada(false);
        setCantidad('');
        setContinuaOperacion(false); // oculta el modulo de busquedaclientes
        setShowCliente(false); // Oculta el modulo de datos clientes
    }

    /*Sirve para continuar la operacion*/
    const continuarOperacion = async() => {
        setContinuaOperacion(true);
        setShowModal(false);
        const response = await getOperacion();
        console.log("RESPONSE: ",response)
        setDatos(response);
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
            hora_operacion: hora,
            monto: parseInt(datos.monto),
            divisa: datos.moneda,
            tipo_cambio: datos.tipo_cambio,
            cantidad_entregar: datos.cantidad_entregar
        }

        console.log(operacionEnvia);

        const encryptedData = encryptRequest(operacionEnvia);

        const pre_operacion = await hacerOperacion(encryptedData);
        return pre_operacion;
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
        if (parseFloat(cantidad) > dataG.limite_diario) {
            toast.warn(`Esta sucursal solo permite un límite diario de $${dataG.limite_diario} por cliente.`, OPTIONS);
        } else {
            setShowModal(true);
        }
    }

    return (
        <>
            <form className="row g-3" onSubmit={handleSubmitCotizacion} noValidate>
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
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
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
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
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
                                        message: 'El campo Cantidad Recibida no puede estar vacío.'
                                    },
                                    validate: {
                                        moneda: (value) => validarMoneda("Cantidad Recibida", value),
                                        mayorACero: value => parseFloat(value) > 0 || "La Cantidad Recibida debe ser mayor a 0"
                                    }
                                })}
                                type="text"
                                className={`form-control ${!!errors?.monto ? 'is-invalid' : ''}`}
                                id="monto"
                                name="monto"
                                placeholder="Ingresa la cantidad recibida por el cliente"
                            />
                            <label htmlFor="monto" className="form-label">CANTIDAD RECIBIDA <i>({muestraDivisa(1)})</i></label>
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
                                        />
                                        <label htmlFor="floatingCE">CANTIDAD A ENTREGAR <i>({muestraDivisa(2)})</i></label>
                            </div>
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="button" onClick={clearForm} className="btn btn-secondary me-2">
                        <i className="bi bi-file-earmark-plus"></i> <strong>NUEVA COTIZACIÓN</strong>
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success d-flex p-3"
                    >
                        <i className="bi bi-cash-coin me-2"></i>
                        <strong>COTIZAR</strong>
                    </button>
                </div>
            </form>

            {
                cantidad !== 0 && (<ModalConfirm title={`La cotización fue de ${FormatoMoneda(parseFloat(cantidad),'')} ¿Desea realizar una operación con esta cotización?`}
                          showModal={showModal}
                          closeModal={closeModal}
                          hacerOperacion={continuarOperacion}
                          closeModalAndReturn={closeModalAndReturn}
                          icon="bi bi-exclamation-triangle-fill text-warning m-2"
                />)
            }
            <Overlay showOverlay={showOverlay}/>
        </>
    );
};
