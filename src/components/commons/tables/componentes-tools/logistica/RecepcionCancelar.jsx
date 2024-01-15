import {useState} from "react";
import {useForm} from "react-hook-form";
import {dataG} from "../../../../../App";
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest,
    getDenominacion, obtenerObjetoDenominaciones,
    OPTIONS,
    validarAlfaNumerico
} from "../../../../../utils";
import {accionesSolicitudBoveda} from "../../../../../services/operacion-logistica";
import {toast} from "react-toastify";
import {ModalAccionCancelarTool} from "../../../modals";

export const RecepcionCancelar = ({item, index,refresh}) => {
    const [showModal, setShowModal] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const showModalCancelar = () => {
        setShowModal(true);
    };

    const handleCancelarEnvio = async (data) => {
        data.ID = item.ID;
        data.accion = "Cancelado";
        data.usuario = dataG.usuario;

        const encryptedData = encryptRequest(data);
        const response = await accionesSolicitudBoveda(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
        }
    };

    const handleConfirmaValores = async (data) => {

        /*
        const values = {
            ID: item.ID,
            accion: (optionBtn === 1) ? 'Confirmado' : 'Rechazado',
            moneda: item.Divisa,
            motivo: watch("motivo"),
            operacion: 'DOTACION BOVEDA',
            ticket: item['No Movimiento'],
            usuario: dataG.usuario,
            tipo_cambio: parseFloat(data.tipo_cambio),
            tipo_banco: data.tipo_banco,
            factura: data.factura,
        }

        const formValuesB = getDenominacion(item.Divisa,myDenominacion)
        eliminarDenominacionesConCantidadCero(formValuesB);
        const denominaciones = obtenerObjetoDenominaciones(formValuesB);
        denominaciones.divisa = item.Divisa;
        denominaciones.movimiento = 'CONFIRMA BOVEDA';

        values.denominacion = [
            denominaciones,
        ]

        console.log("CONFIRMA DOTACION A A BOVEDA")
        console.log(values)
        const encryptedData = encryptRequest(values);
        const resultado = await accionesSolicitudBoveda(encryptedData);

        if(resultado){
            setGuarda(false);
            toast.success(resultado,OPTIONS);
            setShowModal(false)
        }else {
            toast.error('Hubo un problema con la solicitud, intentelo de nuevo o más tarde.',OPTIONS);
        }
        reset();
        resetea();
        refresh();*/
    }

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: 'Cancelar Dotación a Bóveda',
        subtitle: 'Ingrese el motivo por el cual desea cancelar el envío de dotación a la bóveda.',
    };

    return (
        <td key={index} className="text-center">
            <button  className="btn btn-primary me-2"
                     data-bs-toggle="tooltip"
                     data-bs-placement="top"
                     title="ACEPTAR"
                     disabled={item.Estatus !== 'En Transito'}
                     onClick={handleConfirmaValores}>
                <i className="bi bi-check-circle"></i>
            </button>
            <button
                className="btn btn-danger"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="CANCELAR"
                disabled={item.Estatus !== 'Pendiente' && item.Estatus !== 'En Transito' }
                onClick={showModalCancelar}
            >
                <i className="bi bi-x-circle"></i>
            </button>
            {showModal && (
                <ModalAccionCancelarTool options={options}>
                    <div>
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
                                <label htmlFor="motivo">MOTIVO</label>
                                {
                                    errors?.motivo &&
                                    <div className="invalid-feedback-custom">{errors?.motivo.message}</div>
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                            <button type="button" className="btn btn-danger" onClick={handleSubmit(handleCancelarEnvio)}>
                                <i className="bi bi-x-circle me-1"></i>
                                CANCELAR ENVÍO
                            </button>
                        </div>
                    </div>
                </ModalAccionCancelarTool>
            )}
        </td>
    );
}