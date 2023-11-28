/*Herramienta para cancelar desde el perfil de logistica*/
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../../../utils";
import {ModalAccionCancelarTool} from "../../../modals";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {dataG} from "../../../../../App";
import {toast} from "react-toastify";
import {accionesSolicitudBoveda} from "../../../../../services/operacion-logistica";

export const CancelarEnvioBoveda = ({item, index,refresh}) => {
    const [showModal, setShowModal] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const showModalCancelar = () => {
        setShowModal(true);
    };

    const handleCancelarEnvio = async (data) => {
        data.id_operacion = item.ID;
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

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: 'Cancelar Dotación a Bóveda',
        subtitle: 'Ingrese el motivo por el cual desea cancelar el envío de dotación a la bóveda.',
    };

    return (
        <td key={index} className="text-center">
            <button
                className="btn btn-danger"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="CANCELAR"
                disabled={item.Estatus !== 'Por Confirmar'}
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
                                <label htmlFor="motivo">MOTIVO</label>
                                {
                                    errors?.motivo &&
                                    <div className="invalid-feedback-custom">{errors?.motivo.message}</div>
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                            <button type="submit" className="btn btn-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                CANCELAR ENVÍO
                            </button>
                        </div>
                    </form>
                </ModalAccionCancelarTool>
            )}
        </td>
    );
};