/*Herramienta para mostrar las acciones del tesorero (Aceptar o rechazar)*/
import {useState} from "react";
import {toast} from "react-toastify";
import {ModalAccionTesoreriaTool} from "../../../modals";
import {useForm} from "react-hook-form";
import {encryptRequest, validarAlfaNumerico, validarMoneda} from "../../../../../utils";
import {accionesTesoreria} from "../../../../../services/tools-services";
import {dataG} from "../../../../../App";

export const AccionesTesoreria = ({item, index, refresh}) => {

    const [showModal, setShowModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}, reset
        , watch
    } = useForm();
    const [optionBtn, setOptionBtn] = useState(1);

    /*Aqui se diferencia entre un boton de aceptar y otro de rechazar*/
    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }
    const onEnvioValores = async () => {
        const values = {
            id_operacion: item.ID,
            ticket: item['No Movimiento'],
            estatus: (optionBtn === 1) ? 'Aceptado' : 'Rechazado',
            motivo: watch("motivo"),
            usuario: dataG.usuario,
            sucursal: item['Sucursal Envia'],
            monto_equivalente: (optionBtn === 1) ? watch("monto_equivalente") : item.Monto,
            monto: item.Monto,
            moneda: item.Moneda
        }

        const encryptedData = encryptRequest(values);

        const response = await accionesTesoreria(encryptedData);

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


    }

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: (optionBtn === 1) ? 'ACEPTAR DOTACIÓN' : 'RECHAZAR DOTACIÓN',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn === 1) ? 'Ingresa el monto equivalente solicitado y el motivo para aceptar la dotación.'
            : 'Ingresa el motivo por el cual rechazas la dotación.',
    };


    return (
        <td key={index} className="text-center">
            <button className="btn btn-primary me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="ACEPTAR"
                    onClick={() => onHandleOptions(1)} disabled={item.Estatus !== 'Pendiente'}>
                <i className="bi bi-check-circle"></i>
            </button>
            <button className="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="RECHAZAR"
                    onClick={() => onHandleOptions(2)} disabled={item.Estatus !== 'Pendiente'}>
                <i className="bi bi-x-circle"></i>
            </button>
            {
                showModal
                && (
                    <ModalAccionTesoreriaTool options={options}>
                        <div>
                            {
                                optionBtn === 1 && (
                                    <div className="col-md-12 mb-3">
                                        <div className="form-floating">
                                            <input
                                                {...register("monto_equivalente", {
                                                    validate: (value) => validarMoneda("Monto Equivalente", value)
                                                })}
                                                type="text"
                                                className={`form-control ${!!errors?.monto_equivalente ? 'invalid-input' : ''}`}
                                                id="monto_equivalente"
                                                name="monto_equivalente"
                                                placeholder="Ingresa el Monto Equivalente"
                                                autoComplete="off"
                                            />
                                            <label htmlFor="monto_equivalente">MONTO EQUIVALENTE DE {item.Moneda} EN MXP</label>
                                            {
                                                errors?.monto_equivalente && <div
                                                    className="invalid-feedback-custom">{errors?.monto_equivalente.message}</div>
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
                                    <label htmlFor="motivo">MOTIVO</label>
                                    {
                                        errors?.motivo &&
                                        <div className="invalid-feedback-custom">{errors?.motivo.message}</div>
                                    }
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <button type="button" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                        onClick={handleSubmit(onEnvioValores)}>
                                    <i className={(optionBtn === 1) ? 'bi bi-check-circle m-2' : 'bi bi-x-circle m-2'}></i>
                                    {optionBtn === 1 ? 'ACEPTAR' : 'RECHAZAR'}
                                </button>
                            </div>
                        </div>
                    </ModalAccionTesoreriaTool>
                )}
        </td>
    );
}