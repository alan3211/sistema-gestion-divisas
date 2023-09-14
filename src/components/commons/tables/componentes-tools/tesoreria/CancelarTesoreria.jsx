import {useState} from "react";
import {useForm} from "react-hook-form";
import {dataG} from "../../../../../App";
import {encryptRequest, validarAlfaNumerico} from "../../../../../utils";
import {cancelarEnvioSucursal} from "../../../../../services/tools-services";
import {toast} from "react-toastify";
import {ModalAccionCancelarTool} from "../../../modals";

export const CancelarTesoreria = ({item, index,refresh}) => {
    const [showModal, setShowModal] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const showModalCancelar = () => {
        setShowModal(true);
    };

    const handleCancelarEnvio = async (data) => {
        data.id_operacion = item.ID;
        data.sucursal = item.Sucursal;
        data.usuario = dataG.usuario;

        const encryptedData = encryptRequest(data);
        const response = await cancelarEnvioSucursal(encryptedData);

        if (response.result_set[0].Mensaje !== '') {
            toast.success(response.result_set[0].Mensaje, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
            setShowModal(false);
            refresh();
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