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
                    data-bs-placement="top" title="Cancelar Operación" disabled={item.Estatus === 'Cotizado'}>
                <i className="bi bi-x-circle"></i>
            </button>
            {
                showModal
                && (
                    <ModalAccionesTool options={options}>
                        <form onSubmit={handleSubmit(onEnvioValores)} noValidate>
                            <div className="col-md-6">
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
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <div className="input-group mb-3">
                                        <span className="input-group-text text-blue"><i className="bi bi-lock-fill"></i></span>
                                        <input
                                            {...register("password",{
                                                required:{
                                                    value:true,
                                                    message:'El campo contraseña no puede ser vacio.'
                                                },
                                                minLength:{
                                                    value:5,
                                                    message:'El campo contraseña como mínimo debe de tener al menos 5 caracteres.'
                                                }
                                            })}
                                            type="password"
                                            className={`form-control ${!!errors.password ? 'invalid-input':''}`}
                                            id="password"
                                            name="password"
                                            placeholder="Contraseña"
                                        />
                                        <label htmlFor="motivo">CONTRASEÑA</label>
                                        {
                                            errors.password && <div className="invalid-feedback-custom">{errors.password.message}</div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-2">
                                <button type="submit" className='btn btn-primary' >
                                    <i className='bi bi-check-circle m-2'></i>
                                    AUTORIZAR
                                </button>
                            </div>
                        </form>
                    </ModalAccionesTool>
                )}
            {

            }
        </td>
    );
}