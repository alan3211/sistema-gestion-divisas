import {useState} from "react";
import {useForm} from "react-hook-form";
import {dataG} from "../../../../../App";
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../../../utils";
import {cancelarEnvioSucursal} from "../../../../../services/tools-services";
import {toast} from "react-toastify";
import {ModalAccionCancelarTool} from "../../../modals";

export const CancelarTesoreria = ({item, index,refresh}) => {
    const [showModal, setShowModal] = useState(false);
    const {register,setValue, handleSubmit, formState: {errors}, reset} = useForm();
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
            toast.success(response.result_set[0].Mensaje, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
        }
    };

    const options = {
        showModal,
        closeModal: () => setShowModal(false),
        title: 'Cancelar Dotación',
        subtitle: 'Ingrese el motivo por el cual desea cancelar el envío a la sucursal.',
    };

    return (
        <td key={index} className="text-center">
            <button
                className="btn btn-danger"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="CANCELAR"
                disabled={item.Estatus !== 'Pendiente'}
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
                                            minLength: {
                                                value: 25,
                                                message: 'El campo Motivo como mínimo debe tener más de 25 caracteres.'
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
                                        onChange={(e) => {
                                            const upperCaseValue = e.target.value.toUpperCase();
                                            e.target.value = upperCaseValue;
                                            setValue("motivo", upperCaseValue);
                                        }}
                                        style={{
                                            minHeight: 'calc(100vh - 235px)',
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
                            <button type="button" className="btn btn-danger"
                                    onClick={handleSubmit(handleCancelarEnvio)}>
                                <i className="bi bi-x-circle me-1"></i>
                                CANCELAR ENVÍO
                            </button>
                        </div>
                    </div>
                </ModalAccionCancelarTool>
            )}
        </td>
    );
};