import {encryptRequest, obtenerObjetoDenominaciones, validarAlfaNumerico} from "../../../../../utils";
import {accionesCaja, muestraDenominaciones} from "../../../../../services/tools-services";
import {ModalAccionesTool} from "../../../modals";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";

export const CancelarOperacion = ({item, index, refresh}) => {

    const [showModal, setShowModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}, reset
        , watch
    } = useForm();

    const cancelarOperacion = async () => {

    }
    const onEnvioValores = async () => {

    }

    const options = {
        showModal,
        closeCustomModal: () => {setShowModal(false); reset()},
        title: 'Cancelar Operación',
        icon: 'bi bi-x-circle m-2 text-danger',
        subtitle: '',
    };

    return (
        <td key={index} className="text-center">
            <button className="btn btn-danger me-2" data-bs-toggle="tooltip"
                    data-bs-placement="top" title="Cancelar Operación">
                <i className="bi bi-x-circle"></i>
            </button>
            {
                showModal
                && (
                    <ModalAccionesTool options={options}>
                        <form onSubmit={handleSubmit(onEnvioValores)} noValidate>
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
                            )

                            <div className="d-flex justify-content-end mt-2">
                                <button type="submit" className='btn btn-primary'>
                                    <i className='bi bi-check-circle m-2'></i>
                                    AUTORIZAR
                                </button>
                            </div>
                        </form>
                    </ModalAccionesTool>
                )}
        </td>
    );
}