/*Herramienta para cancelar desde el perfil de logistica*/
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../../../utils";
import {ModalGenericTool} from "../../../modals";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {dataG} from "../../../../../App";
import {toast} from "react-toastify";
import {accionesSolicitudBoveda} from "../../../../../services/operacion-logistica";
import {accionesSolicitudValores} from "../../../../../services/tools-services";

export const CancelarEnvioBoveda = ({item, index,refresh}) => {
    const [showModal, setShowModal] = useState(false);
    const {register,
        handleSubmit,
        formState: {errors},
        watch,
        reset,setValue} = useForm();

    const [optionBtn, setOptionBtn] = useState(1);

    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }

    const handleCancelarEnvio = handleSubmit(async (data) => {
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
    });

    const handleConfirmaValores = handleSubmit(async (data) => {

        const values = {
            ID: item.ID,
            accion: 'Confirmado',
            moneda: item.Divisa,
            motivo: watch("motivo"),
            operacion: 'CONFIRMA DOTACION BOVEDA',
            ticket: item['No Movimiento'],
            usuario: dataG.usuario,
            tipo_cambio: 0.0,
            tipo_banco: '',
            factura: '',
        }

        const encryptedData = encryptRequest(values);
        const response = await accionesSolicitudBoveda(encryptedData);

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
        title: (optionBtn === 1) ? 'Confirmación de Valores' :'Cancelar Dotación a Bóveda',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn === 1) ? '¿Deseas confirmar los valores para esta boveda?' : 'Ingrese el motivo por el cual desea cancelar el envío de dotación a la bóveda.',
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
                disabled={item.Estatus !== 'Por Confirmar' && item.Estatus !== 'En Transito' }
                onClick={() => onHandleOptions(2)}
            >
                <i className="bi bi-x-circle"></i>
            </button>
            {showModal && (
                <ModalGenericTool options={options}>
                    <>
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
                        <div className="d-flex justify-content-end mt-3">
                            <button type="button" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                    onClick={optionBtn === 1 ? handleConfirmaValores:handleCancelarEnvio}>
                                <i className={(optionBtn === 1) ? 'bi bi-check-circle m-2' : 'bi bi-x-circle m-2'}></i>
                                {optionBtn === 1 ? 'SI, CONFIRMAR VALORES' : 'RECHAZAR'}
                            </button>
                        </div>
                    </>
                </ModalGenericTool>
            )}
        </td>
    );
};