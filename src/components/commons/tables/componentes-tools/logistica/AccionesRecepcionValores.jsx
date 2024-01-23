import {useState} from "react";
import {useForm} from "react-hook-form";
import {dataG} from "../../../../../App";
import {
    encryptRequest,
    OPTIONS,
    validarAlfaNumerico, validarMoneda
} from "../../../../../utils";
import {toast} from "react-toastify";
import {ModalAccionCancelarTool, ModalGenericTool} from "../../../modals";
import {accionesSolicitudValores} from "../../../../../services/tools-services";

export const AccionesRecepcionValores = ({item, index,refresh}) => {
    const [showModal, setShowModal] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset,setValue} = useForm();

    const [optionBtn, setOptionBtn] = useState(1);

    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }
    const handleCancelarEnvio = handleSubmit(async (data) => {
        data.ticket = item['No Movimiento'];
        data.estatus = "Cancelado";
        data.usuario = dataG.usuario;
        const encryptedData = encryptRequest(data);
        const response = await accionesSolicitudValores(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
        }
    });

    const handleConfirmaValores = handleSubmit(async (data) => {
        data.ticket = item['No Movimiento'];
        data.estatus = "Aceptado";
        data.usuario = dataG.usuario;
        const encryptedData = encryptRequest(data);
        const response = await accionesSolicitudValores(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
        }
    });

    const options = {
        size:'md',
        showModal,
        closeModal: () => setShowModal(false),
        title:  (optionBtn === 1) ? 'Confirmación de Valores' :'Cancelar Envio de Solicitud de Valores a Sucursal',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn === 1) ? 'Ingrese comentarios para este envio de valores.':'Ingrese el motivo por el cual desea cancelar la solicitud de valores a sucursal.',
    };

    return (
        <td key={index} className="text-center">
            <button  className="btn btn-primary me-2"
                     data-bs-toggle="tooltip"
                     data-bs-placement="top"
                     title="ACEPTAR"
                     disabled={item.Estatus !== 'En transito'}
                     onClick={() => onHandleOptions(1)}>
                <i className="bi bi-check-circle"></i>
            </button>
            <button
                className="btn btn-danger"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="CANCELAR"
                disabled={item.Estatus !== 'Pendiente' && item.Estatus !== 'En Transito' }
                onClick={() => onHandleOptions(2)}
            >
                <i className="bi bi-x-circle"></i>
            </button>
            {showModal && (
                <ModalGenericTool options={options}>
                    <div className="row">
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
                                        placeholder="Ingresa el motivo"
                                        onChange={(e) => {
                                            const upperCaseValue = e.target.value.toUpperCase();
                                            e.target.value = upperCaseValue;
                                            setValue("motivo", upperCaseValue);
                                        }}
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
                        <div className="d-flex justify-content-end mt-3">
                            <button type="button" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                    onClick={optionBtn === 1 ? handleConfirmaValores:handleCancelarEnvio}>
                                <i className={(optionBtn === 1) ? 'bi bi-check-circle m-2' : 'bi bi-x-circle m-2'}></i>
                                {optionBtn === 1 ? 'ACEPTAR' : 'RECHAZAR'}
                            </button>
                        </div>
                    </div>
                </ModalGenericTool>
            )}
        </td>
    );
}