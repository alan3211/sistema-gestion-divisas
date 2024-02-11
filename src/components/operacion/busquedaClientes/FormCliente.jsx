import {useContext, useEffect} from "react";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {
    convertirFecha,
    encryptRequest,
    formattedDate,
    OPTIONS,
    validaFechas,
    validarNombreApellido,
    validarNumeros
} from "../../../utils";
import {buscaCliente, consultaInformacionCarga} from "../../../services";
import {dataG} from "../../../App";
import {toast} from "react-toastify";
import {ModalConfirm, ModalGenericTool} from "../../commons/modals";
import {useNavigate} from "react-router-dom";

export const FormCliente = ({tipo}) => {

    const {
        setCantidad,
        setShowCantidadEntregada,
        operacion,
        setContinuaOperacion,
        reset,
        cliente,
        setCliente, showModalAltaUsuario, setShowModalAltaUsuario,
         setShowAltaCliente,
        busquedaCliente: {
            setShowCliente,
            formBuscarCliente,
            setData,
        }
    } = useContext(CompraVentaContext);

    useEffect(() => {
        formBuscarCliente.setValue("cliente",cliente)
        const data = {
            cliente
        }
        handleValidateForm(data);
    }, [cliente]);

    const handleValidateForm = formBuscarCliente.handleSubmit(async (data) => {
        console.log(data)
        data.tipo_busqueda = tipo === 'cliente' ? 1 : 2
        data.limite_diario = dataG.limite_diario;
        data.limite_mensual = dataG.limite_mensual;

        if (operacion.tipo_operacion === '1') {
            data.monto = parseInt(operacion.monto);
        } else {
            data.monto = parseInt(operacion.cantidad_entregar)
        }
        if (data.tipo_busqueda === 1) {
            data.nombre = '';
            data.apellido_paterno = '';
            data.apellido_materno = '';
            data.fecha_nacimiento = '';
        } else {
            data.cliente = '';
        }
        data.tipo_operacion =  operacion.tipo_operacion;
        console.log("DATOS: ", data)
        const encryptedData = encryptRequest(data);
        const dataClientes = await buscaCliente(encryptedData);
        dataClientes.headers = ['Selecciona', ...dataClientes.headers]
        console.log(dataClientes)
        if (dataClientes.total_rows > 0) {
            if (dataClientes.total_rows === 1) {
                console.log("UN REGISTRO", dataClientes);
                if (dataClientes.result_set[0].hasOwnProperty('Resultado')) {
                    const mensaje = dataClientes.result_set[0].Resultado;

                    if (mensaje.includes('excede')) {
                        toast.warn(mensaje, OPTIONS);
                    } else {
                        toast.error(mensaje, OPTIONS);
                        reset();
                        setCantidad('');
                        setShowCantidadEntregada(false);
                    }
                    setShowCliente(false);
                    setContinuaOperacion(false);
                } else {
                    setShowCliente(true);
                    setContinuaOperacion(true);
                }
            } else {
                const mensaje = 'A continuación, se muestran los siguientes clientes con coincidencias.';
                toast.info(mensaje, OPTIONS);
            }
            setData(dataClientes);
        } else {
            setShowModalAltaUsuario(true); // Me muestra un mensaje de alerta indicandome que el usuario que busque no existe y me pregunta si deseo registrarlo
        }
    });

    const clearBuscaCliente = () => {
        formBuscarCliente.reset();
        setCliente('');
        setShowCliente(false);
    }

    return (<>
            <form className="row g-3">
                {
                    tipo === 'cliente'
                        ? (
                            <div className="col-md-3">
                                <div className="form-floating">
                                    <input
                                        {...formBuscarCliente.register("cliente", {
                                            required: {
                                                value: true,
                                                message: 'El campo Número de Usuario no puede ser vacio.'
                                            },
                                            minLength: {
                                                value: 2,
                                                message: 'El campo Número de Usuario como mínimo debe de tener al menos 2 caracteres.'
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: 'El campo Número de Usuario como máximo debe de tener no mas de 10 caracteres.'
                                            },
                                            validate: (value) => validarNumeros("Número de Cliente", value)
                                        })}
                                        type="text"
                                        className={`form-control ${!!formBuscarCliente.formState.errors?.cliente ? 'invalid-input' : ''}`}
                                        id="cliente"
                                        name="cliente"
                                        placeholder="Ingresa el número del usuario"
                                        onChange={(e) => {
                                            const upperCaseValue = e.target.value.toUpperCase();
                                            e.target.value = upperCaseValue;
                                            formBuscarCliente.setValue("cliente", upperCaseValue);
                                        }}
                                        autoComplete="off"
                                    />
                                    <label htmlFor="cliente">NÚMERO DE USUARIO</label>
                                    {
                                        formBuscarCliente.formState.errors?.cliente && <div
                                            className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.cliente.message}</div>
                                    }
                                </div>
                            </div>
                        )
                        : (
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input
                                            {...formBuscarCliente.register("nombre", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Nombre no puede ser vacio.'
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: 'El campo Nombre como mínimo debe de tener al menos 2 caracteres.'
                                                },
                                                maxLength: {
                                                    value: 30,
                                                    message: 'El campo Nombre como máximo debe de tener no mas de 30 caracteres.'
                                                },
                                                validate: (value) => validarNombreApellido("Nombre", value)
                                            })}
                                            type="text"
                                            className={`form-control ${!!formBuscarCliente.formState.errors?.nombre ? 'invalid-input' : ''}`}
                                            id="nombre"
                                            name="nombre"
                                            placeholder="Ingresa el nombre del usuario"
                                            onChange={(e) => {
                                                const upperCaseValue = e.target.value.toUpperCase();
                                                e.target.value = upperCaseValue;
                                                formBuscarCliente.setValue("nombre", upperCaseValue);
                                            }}
                                            autoComplete="off"
                                        />
                                        <label htmlFor="nombre">NOMBRE(S)</label>
                                        {
                                            formBuscarCliente.formState.errors?.nombre && <div
                                                className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.nombre.message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input
                                            {...formBuscarCliente.register("apellido_paterno", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Apellido Paterno no puede ser vacio.'
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: 'El campo Apellido Paterno como mínimo debe de tener al menos 2 caracteres.'
                                                },
                                                maxLength: {
                                                    value: 30,
                                                    message: 'El campo Apellido Paterno como máximo debe de tener no mas de 30 caracteres.'
                                                },
                                                validate: (value) => validarNombreApellido("Apellido Paterno", value)
                                            })}
                                            type="text"
                                            className={`form-control ${!!formBuscarCliente.formState.errors?.apellido_paterno ? 'invalid-input' : ''}`}
                                            id="apellido_paterno"
                                            name="apellido_paterno"
                                            placeholder="Ingresa el apellido paterno"
                                            onChange={(e) => {
                                                const upperCaseValue = e.target.value.toUpperCase();
                                                e.target.value = upperCaseValue;
                                                formBuscarCliente.setValue("apellido_paterno", upperCaseValue);
                                            }}
                                            autoComplete="off"
                                        />
                                        <label htmlFor="apellido_paterno">APELLIDO PATERNO</label>
                                        {
                                            formBuscarCliente.formState.errors?.apellido_paterno && <div
                                                className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.apellido_paterno.message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input
                                            {...formBuscarCliente.register("apellido_materno", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Apellido Materno no puede ser vacio.'
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: 'El campo Apellido Materno como mínimo debe de tener al menos 2 caracteres.'
                                                },
                                                maxLength: {
                                                    value: 30,
                                                    message: 'El campo Apellido Materno como máximo debe de tener no mas de 30 caracteres.'
                                                },
                                                validate: (value) => validarNombreApellido("Apellido Materno", value)
                                            })}
                                            type="text"
                                            className={`form-control ${!!formBuscarCliente.formState.errors?.apellido_materno ? 'invalid-input' : ''}`}
                                            id="apellido_materno"
                                            name="apellido_materno"
                                            placeholder="Ingresa el apellido materno"
                                            onChange={(e) => {
                                                const upperCaseValue = e.target.value.toUpperCase();
                                                e.target.value = upperCaseValue;
                                                formBuscarCliente.setValue("apellido_materno", upperCaseValue);
                                            }}
                                            autoComplete="off"
                                        />
                                        <label htmlFor="apellido_materno">APELLIDO MATERNO</label>
                                        {
                                            formBuscarCliente.formState.errors?.apellido_materno && <div
                                                className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.apellido_materno.message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input
                                            {...formBuscarCliente.register("fecha_nacimiento", {
                                                required: {
                                                    value: true,
                                                    message: 'El campo Fecha Nacimiento no puede ser vacio.'
                                                },
                                                validate: validaFechas
                                            })}
                                            type="date"
                                            className={`form-control ${!!formBuscarCliente.formState.errors?.fecha_nacimiento ? 'invalid-input' : ''}`}
                                            id="fecha_nacimiento"
                                            name="fecha_nacimiento"
                                            placeholder="Ingresa la fecha de nacimiento"
                                            autoComplete="off"
                                        />
                                        <label htmlFor="fecha_nacimiento">FECHA NACIMIENTO</label>
                                        {
                                            formBuscarCliente.formState.errors?.fecha_nacimiento && <div
                                                className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.fecha_nacimiento.message}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                }

                <div className={`${tipo !== 'cliente' ? 'col-md-12 d-flex justify-content-center' : 'col-md-9'}`}>
                    <button
                        type="button"
                        className="m-2 btn btn-secondary gap-2 p-2"
                        onClick={clearBuscaCliente}>
                        <strong>LIMPIAR</strong>
                        <i className="bi bi-trash-fill ms-2"></i>
                    </button>
                    <button
                        type="button"
                        onClick={handleValidateForm}
                        className="m-2 btn btn-primary gap-2 p-2">
                        <strong>BUSCAR</strong>
                        <i className="bi bi-search ms-2"></i>
                    </button>
                </div>
            </form>
            {
                showModalAltaUsuario && (
                    <ModalConfirm title={`El usuario no existe registrado en el sistema. ¿Desea realizar un alta de usuario?`}
                                  showModal={showModalAltaUsuario}
                                  closeModal={()=> setShowModalAltaUsuario(false)}
                                  hacerOperacion={()=>{
                                      setContinuaOperacion(false);
                                      setShowAltaCliente(true);
                                      setShowModalAltaUsuario(false)
                                  }}
                                  closeModalAndReturn={()=> {
                                      setShowModalAltaUsuario(false);
                                      formBuscarCliente.setValue("nombre","");
                                      formBuscarCliente.setValue("apellido_paterno","");
                                      formBuscarCliente.setValue("apellido_materno","");
                                      formBuscarCliente.setValue("fecha_nacimiento","");
                                      formBuscarCliente.setValue("cliente","");
                                      setContinuaOperacion(false)

                                  }}
                                  icon="bi bi-exclamation-triangle-fill text-warning m-2"
                    />)
            }
        </>
    );
}