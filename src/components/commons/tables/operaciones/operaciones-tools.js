import React, {useState} from "react";
import {
    encryptRequest,
    formattedDateWS,
    opciones,
    validarAlfaNumerico,
    validarMoneda,
    validarNombreApellido
} from "../../../../utils";
import {dataG} from "../../../../App";
import {ModalAccionCancelarTool, ModalAccionTesoreriaTool, ModalDetalleTool} from "../../modals/";
import {accionesTesoreria, cancelarEnvioSucursal, consultaDetalle} from "../../../../services/tools-services";
import {TableComponent} from "../TableComponent";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";

/*Herramienta para mostrar el estatus (Pendiente, Rechazado, Aceptado)*/
const EstatusTool = ({item, index, columna}) => {
    const estatus = {
        Pendiente: {icono: 'ri ri-hourglass-line me-2', estilo: 'btn-warning'},
        Aceptado: {icono: 'ri ri-checkbox-circle-line me-2', estilo: 'btn-success'},
    };

    const estadoActual = estatus[item[columna]] || {icono: 'ri ri-close-circle-line me-2', estilo: 'btn-danger'};

    return (
        <td key={index} className="text-center">
            <div
                className={`text-white btn ${estadoActual.estilo} mb-2`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-original-title={item[columna]}
            >
        <span className="badge">
          <i className={estadoActual.icono}></i>
            {item[columna]}
        </span>
            </div>
        </td>
    );
};

/*Herramienta para mostrar las acciones del tesorero (Aceptar o rechazar)*/
const AccionesTesoreria = ({item, index, columna}) => {

    const [showModal, setShowModal] = useState(false);
    const {register,
        handleSubmit,
        formState: {errors},reset
        ,watch} = useForm();
    const [optionBtn,setOptionBtn] = useState(1);

    /*Aqui se diferencia entre un boton de aceptar y otro de rechazar*/
    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }
    const onEnvioValores = async () => {
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");
        const values = {
            id_operacion: item.ID,
            ticket: `ENVVAL${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`,
            estatus: (optionBtn === 1) ? 'Aceptado':'Rechazado',
            motivo: watch("motivo"),
            usuario: dataG.usuario,
            sucursal: item['Sucursal Envia'],
            monto_equivalente:(optionBtn === 1) ? watch("monto_equivalente"): item.Monto,
            monto:item.Monto,
            moneda:item.Moneda
        }

        const encryptedData = encryptRequest(values);

        const response =  await accionesTesoreria(encryptedData);

        if(response.result_set[0].Mensaje !== ''){
            toast.success(response.result_set[0].Mensaje, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                onClose: () => setShowModal(false),
            });
            reset();
        }


    }

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: (optionBtn === 1) ? 'Aceptar Dotación':'Rechazar Dotación',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success':'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn === 1) ? 'Ingresa el monto equivalente solicitado y el motivo para aceptar la dotación.'
            :'Ingresa el motivo por el cual rechazas la dotación.',
    };


    return (
        <td key={index} className="text-center">
            <button className="btn btn-primary me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Aceptar"
                    onClick={()=> onHandleOptions(1)} disabled={item.Estatus !== 'Pendiente'}>
                <i className="bi bi-check-circle"></i>
            </button>
            <button className="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Rechazar"
                    onClick={()=> onHandleOptions(2)} disabled={item.Estatus !== 'Pendiente'}>
                <i className="bi bi-x-circle"></i>
            </button>
            {
                showModal
                && (
                <ModalAccionTesoreriaTool options={options}>
                    <form onSubmit={handleSubmit(onEnvioValores)} noValidate>
                        {
                            optionBtn === 1 && (
                                <div className="col-md-12 mb-3">
                                    <div className="form-floating">
                                        <input
                                            {...register("monto_equivalente",{
                                                validate: (value) => validarMoneda("Monto Equivalente",value)
                                            })}
                                            type="text"
                                            className={`form-control ${!!errors?.monto_equivalente ? 'invalid-input':''}`}
                                            id="monto_equivalente"
                                            name="monto_equivalente"
                                            placeholder="Ingresa el Monto Equivalente"
                                        />
                                        <label htmlFor="monto_equivalente">Monto Equivalente de {item.Moneda} en MXP</label>
                                        {
                                            errors?.monto_equivalente && <div className="invalid-feedback-custom">{errors?.monto_equivalente.message}</div>
                                        }
                                    </div>
                                </div>
                            )
                        }
                        <div className="col-md-12">
                            <div className="form-floating">
                                    <textarea
                                        {...register("motivo", {
                                            required: {
                                                value: true,
                                                message: 'El campo Motivo no puede ser vacío.'
                                            },
                                            maxLength: {
                                                value: 200,
                                                message: 'El campo Motivo como máximo debe tener no más de 200 caracteres.'
                                            },
                                            validate: (value) => validarAlfaNumerico("Motivo", value)
                                        })}
                                        className={`form-control ${!!errors?.motivo ? 'is-invalid' : ''}`}
                                        id="motivo"
                                        name="motivo"
                                        placeholder="Ingresa el motivo de cancelación"
                                        style={{
                                            height: '300px',
                                            resize: 'none'
                                        }}
                                    />
                                <label htmlFor="motivo">Motivo</label>
                                {
                                    errors?.motivo &&
                                    <div className="invalid-feedback-custom">{errors?.motivo.message}</div>
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                            <button type="submit" className={`btn ${optionBtn === 1 ? 'btn-success':'btn-danger'}`}>
                                <i className={(optionBtn === 1) ? 'bi bi-check-circle m-2':'bi bi-x-circle m-2'}></i>
                                {optionBtn === 1 ? 'Aceptar':'Rechazar'}
                            </button>
                        </div>
                    </form>
                </ModalAccionTesoreriaTool>
            )}
        </td>
    );
}

/*Herramienta para visualizar los detalles de cada modulo mostrando un modal*/
const Detalle = ({item, index, columna,params}) => {

    const [showModal, setShowModal] = useState(false);
    const [dataDetalle, setDataDetalle] = useState({})

    const showDetalle = () => {
        onDetalle();
    }

    const onDetalle = async () => {
        const values = {
            opcion: params.opcion,
            id_operacion: item.ID,
        }
        const encryptedData = encryptRequest(values);
        const response = await consultaDetalle(encryptedData);
        setDataDetalle(response);
        setShowModal(true);
    }

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: 'Detalle',
    }


    return (
        <td key={index} className="text-center">
            <button className="btn btn-secondary me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Detalle"
                    onClick={showDetalle} disabled={item.Estatus === 'Pendiente'}>
                <i className="bi bi-folder"></i>
            </button>
            {showModal && <ModalDetalleTool options={options}>
                <TableComponent data={dataDetalle}/>
            </ModalDetalleTool>}
        </td>
    );
}

const CancelarTesoreria = ({item, index}) => {
    const [showModal, setShowModal] = useState(false);
    const {register, handleSubmit, formState: {errors},reset} = useForm();
    const showModalCancelar = () => {
        setShowModal(true);
    };

    const handleCancelarEnvio = async(data) => {
        data.id_operacion = item.Id;
        data.sucursal = item.Sucursal;
        data.usuario = dataG.usuario;
        console.log(data)

        const encryptedData = encryptRequest(data);
        const response = await cancelarEnvioSucursal(encryptedData);

        if(response.result_set[0].Mensaje !== ''){
            toast.success(response.result_set[0].Mensaje, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                onClose: () => setShowModal(false),
            });
            reset();
        }
    };

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: 'Cancelar Dotación',
        subtitle: 'Ingrese el motivo por el cual desea cancelar el envío a la sucursal.',
    };

    return (
        <td key={index} className="text-center">
            <button
                className="btn btn-danger"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Cancelar"
                disabled={item.Estatus !== 'Pendiente'}
                onClick={showModalCancelar}
            >
                <i className="bi bi-x-circle"></i>
            </button>
            {showModal && (
                <ModalAccionCancelarTool options={options}>
                    <form onSubmit={handleSubmit(handleCancelarEnvio)} noValidate>
                        <div className="col-md-12">
                            <div className="form-floating">
                                    <textarea
                                        {...register("motivo", {
                                            required: {
                                                value: true,
                                                message: 'El campo Motivo no puede ser vacío.'
                                            },
                                            maxLength: {
                                                value: 200,
                                                message: 'El campo Motivo como máximo debe tener no más de 200 caracteres.'
                                            },
                                            validate: (value) => validarAlfaNumerico("Motivo", value)
                                        })}
                                        className={`form-control ${!!errors?.motivo ? 'is-invalid' : ''}`}
                                        id="motivo"
                                        name="motivo"
                                        placeholder="Ingresa el motivo de cancelación"
                                        style={{
                                            height: '300px',
                                            resize: 'none'
                                        }}
                                    />
                                <label htmlFor="motivo">Motivo</label>
                                {
                                    errors?.motivo &&
                                    <div className="invalid-feedback-custom">{errors?.motivo.message}</div>
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                            <button type="submit" className="btn btn-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                Cancelar Envío
                            </button>
                        </div>
                    </form>
                </ModalAccionCancelarTool>
            )}
        </td>
    );
};


/*Herramienta para seleccionar al cliente y enviar a la operacion*/
const SeleccionarCliente = ({item, index, deps}) => {

    const {setDataClientes = undefined, setShowCliente = undefined} = deps

    const navigate = useNavigate();
    const hacerOperacion = (item) => {
        if (setDataClientes !== undefined && setShowCliente !== undefined) {
            setDataClientes({
                headers: [],
                result_set: [item],
                total_rows: 1
            });
            setShowCliente(true);
        }
        console.log("CLIENTE A ENVIAR DESDE -> CLIENTE COINCIDENCIA:", item)
        navigate("/compraVenta", {
            state: {
                cliente: item.Cliente,
                clienteActivo: true,
            },
        });
    }

    return (
        <td key={index} className="text-center">
            <span className="badge bg-primary m-2 p-2 cursor-pointer"
                  onClick={() => hacerOperacion(item)}>
                <i className="ri-star-line me-2"></i>
                Seleccionar
           </span>
        </td>
    );
}


export const getTools = (toolInfo, item, index) => {

    switch (toolInfo.tool) {
        case 'estatus':
            return <EstatusTool item={item} index={index} columna={toolInfo.columna}/>
        case 'acciones-tesoreria':
            return <AccionesTesoreria item={item} index={index} columna={toolInfo.columna}/>
        case 'detalle':
            return <Detalle item={item} index={index} columna={toolInfo.columna} params={toolInfo.params}/>
        case 'cancelar-tesoreria':
            return <CancelarTesoreria item={item} index={index} columna={toolInfo.columna}/>
        case 'selecciona-cliente':
            return <SeleccionarCliente item={item} index={index} deps={toolInfo.deps}/>
        default:
            return (<td key={index} className="text-center">
                {item[toolInfo.columna]}
            </td>);
    }
}