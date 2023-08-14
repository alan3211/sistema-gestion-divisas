import {useContext} from "react";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {encryptRequest, validaFechas, validarNombreApellido, validarNumeros} from "../../../utils";
import {buscaCliente} from "../../../services";
import {dataG} from "../../../App";
import {toast} from "react-toastify";

export const FormCliente = ({tipo}) => {

    const {
        setCantidad,
        setShowCantidadEntregada,
        operacion,
        setContinuaOperacion,
        reset,
        busquedaCliente:{
            setShowCliente,
            formBuscarCliente,
            setData,
        }} = useContext(CompraVentaContext);

    const handleValidateForm = formBuscarCliente.handleSubmit(async (data) => {
        console.log(data)
        data.tipo_busqueda = tipo === 'cliente' ? 1 : 2
        data.limite_diario= dataG.limite_diario;
        data.limite_mensual= dataG.limite_mensual;

        if(operacion.tipo_operacion === '1'){
            data.monto = parseInt(operacion.monto);
        }else{
            data.monto = parseInt(operacion.cantidad_entregada)
        }
        if(data.tipo_busqueda === 1){
            data.nombre='';
            data.apellido_paterno='';
            data.apellido_materno='';
            data.fecha_nacimiento='';
        }else{
            data.cliente='';
        }
        const encryptedData = encryptRequest(data);
        const dataClientes = await buscaCliente(encryptedData);

        if (dataClientes) {
            if (dataClientes.length === 1) {
                if(dataClientes[0].hasOwnProperty('resultado')){
                    const mensaje = dataClientes[0].resultado;
                    const toastOptions = {
                        position: "top-center",
                        autoClose: 10000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: "colored",
                    };

                    if (mensaje.includes('excede')) {
                        toast.warn(mensaje, toastOptions);
                    } else {
                        toast.error(mensaje, toastOptions);
                        reset();
                        setCantidad('');
                        setShowCantidadEntregada(false);
                    }
                    setShowCliente(false);
                    setContinuaOperacion(false);
                }
                else{
                    setShowCliente(true);
                }
            } else {
                const mensaje = 'A continuación, se muestran los siguientes clientes con coincidencias.';
                const toastOptions = {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                };

                toast.info(mensaje, toastOptions);
            }
        } else {
            const toastOptions = {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored",
            };

            toast.warn('El cliente ingresado no existe', toastOptions);
        }
        setData(dataClientes);
    });

    const clearBuscaCliente = () =>{
        console.log("limpia");
        formBuscarCliente.reset();
    }

    return(
            <form className="row g-3" onSubmit={handleValidateForm} noValidate>
                {
                    tipo === 'cliente'
                        ? (
                            <div className="col-md-3">
                                <div className="form-floating">
                                    <input
                                        {...formBuscarCliente.register("cliente",{
                                            required:{
                                                value:true,
                                                message:'El campo Número de Cliente no puede ser vacio.'
                                            },
                                            minLength:{
                                                value:2,
                                                message:'El campo Número de Cliente como mínimo debe de tener al menos 2 caracteres.'
                                            },
                                            maxLength:{
                                                value:10,
                                                message:'El campo Número de Cliente como máximo debe de tener no mas de 10 caracteres.'
                                            },
                                            validate: (value) => validarNumeros("Número de Cliente",value)
                                        })}
                                        type="text"
                                        className={`form-control ${!!formBuscarCliente.formState.errors?.cliente ? 'invalid-input':''}`}
                                        id="cliente"
                                        name="cliente"
                                        placeholder="Ingresa el número del cliente"
                                    />
                                    <label htmlFor="cliente">Número de Cliente</label>
                                    {
                                        formBuscarCliente.formState.errors?.cliente && <div className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.cliente.message}</div>
                                    }
                                </div>
                            </div>
                        )
                        : (
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input
                                            {...formBuscarCliente.register("nombre",{
                                                required:{
                                                    value:true,
                                                    message:'El campo Nombre no puede ser vacio.'
                                                },
                                                minLength:{
                                                    value:2,
                                                    message:'El campo Nombre como mínimo debe de tener al menos 2 caracteres.'
                                                },
                                                maxLength:{
                                                    value:30,
                                                    message:'El campo Nombre como máximo debe de tener no mas de 30 caracteres.'
                                                },
                                                validate: (value) => validarNombreApellido("Nombre",value)
                                            })}
                                            type="text"
                                            className={`form-control ${!!formBuscarCliente.formState.errors?.nombre ? 'invalid-input':''}`}
                                            id="nombre"
                                            name="nombre"
                                            placeholder="Ingresa el nombre del cliente"
                                        />
                                        <label htmlFor="nombre">Nombre(s)</label>
                                        {
                                            formBuscarCliente.formState.errors?.nombre && <div className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.nombre.message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input
                                            {...formBuscarCliente.register("apellido_paterno",{
                                                required:{
                                                value:true,
                                                message:'El campo Apellido Paterno no puede ser vacio.'
                                            },
                                                minLength:{
                                                value:2,
                                                message:'El campo Apellido Paterno como mínimo debe de tener al menos 2 caracteres.'
                                            },
                                                maxLength:{
                                                value:30,
                                                message:'El campo Apellido Paterno como máximo debe de tener no mas de 30 caracteres.'
                                            },
                                                validate: (value) => validarNombreApellido("Apellido Paterno",value)
                                            })}
                                            type="text"
                                            className={`form-control ${!!formBuscarCliente.formState.errors?.apellido_paterno ? 'invalid-input':''}`}
                                            id="apellido_paterno"
                                            name="apellido_paterno"
                                            placeholder="Ingresa el apellido paterno"
                                        />
                                        <label htmlFor="apellido_paterno">Apellido Paterno</label>
                                        {
                                            formBuscarCliente.formState.errors?.apellido_paterno && <div className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.apellido_paterno.message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input
                                            {...formBuscarCliente.register("apellido_materno",{
                                                required:{
                                                value:true,
                                                message:'El campo Apellido Materno no puede ser vacio.'
                                            },
                                                minLength:{
                                                value:2,
                                                message:'El campo Apellido Materno como mínimo debe de tener al menos 2 caracteres.'
                                            },
                                                maxLength:{
                                                value:30,
                                                message:'El campo Apellido Materno como máximo debe de tener no mas de 30 caracteres.'
                                            },
                                                validate: (value) => validarNombreApellido("Apellido Materno",value)
                                            })}
                                            type="text"
                                            className={`form-control ${!!formBuscarCliente.formState.errors?.apellido_paterno ? 'invalid-input':''}`}
                                            id="apellido_materno"
                                            name="apellido_materno"
                                            placeholder="Ingresa el apellido materno"
                                        />
                                        <label htmlFor="apellido_materno">Apellido Materno</label>
                                        {
                                            formBuscarCliente.formState.errors?.apellido_materno && <div className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.apellido_materno.message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input
                                            {...formBuscarCliente.register("fecha_nacimiento",{
                                                required:{
                                                value:true,
                                                message:'El campo Fecha Nacimiento no puede ser vacio.'
                                            },
                                                validate: validaFechas
                                            })}
                                        type="date"
                                        className={`form-control ${!!formBuscarCliente.formState.errors?.fecha_nacimiento ? 'invalid-input':''}`}
                                        id="fecha_nacimiento"
                                        name="fecha_nacimiento"
                                        placeholder="Ingresa el apellido paterno"
                                        />
                                        <label htmlFor="fecha_nacimiento">Fecha Nacimiento</label>
                                        {
                                            formBuscarCliente.formState.errors?.fecha_nacimiento && <div className="invalid-feedback-custom">{formBuscarCliente.formState.errors?.fecha_nacimiento.message}</div>
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
                        Limpiar
                        <i className="bi bi-x-circle ms-2"></i>
                    </button>
                    <button
                        type="submit"
                        className="m-2 btn btn-primary gap-2 p-2">
                        Buscar
                        <i className="bi bi-search ms-2"></i>
                    </button>
                </div>

            </form>
    );
}