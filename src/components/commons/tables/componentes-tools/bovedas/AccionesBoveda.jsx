/*Herramienta para mostrar las acciones del tesorero (Aceptar o rechazar)*/
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest, FormatoMoneda,
    getDenominacion, obtenerObjetoDenominaciones, OPTIONS,
    validarAlfaNumerico, validarMoneda,
} from "../../../../../utils";
import {ModalAccionTesoreriaTool} from "../../../modals";
import {toast} from "react-toastify";
import {accionesSucursal, accionesTesoreria, getDenominaciones,} from "../../../../../services/tools-services";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Denominacion} from "../../../../operacion/denominacion";
import {DenominacionContext} from "../../../../../context/denominacion/DenominacionContext";
import {DenominacionTable} from "../../../../operacion/denominacion/DenominacionTable";
import {dataG} from "../../../../../App";
import {accionesSolicitudBoveda} from "../../../../../services/operacion-logistica";

export const AccionesBoveda = ({item, index, refresh}) => {

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
            accion: (optionBtn === 1) ? 'Confirmado' : 'Rechazado',
            motivo: watch("motivo"),
            usuario: dataG.usuario,
        }

        const encryptedData = encryptRequest(values);

        const response = await accionesSolicitudBoveda(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
        }


    }

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: (optionBtn === 1) ? 'Confirmar Dotación a Bóveda' : 'Rechazar Dotación de Bóveda',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn !== 1) ? 'Ingresa el motivo por el cual rechazas la dotación a la bóveda.':
            '¿Estas seguro de confirmar la dotación?',
    };


    return (
        <td key={index} className="text-center">
            <button className="btn btn-primary me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="ACEPTAR"
                    onClick={() => onHandleOptions(1)} disabled={item.Estatus !== 'Por Confirmar'}>
                <i className="bi bi-check-circle"></i>
            </button>
            <button className="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="RECHAZAR"
                    onClick={() => onHandleOptions(2)} disabled={item.Estatus !== 'Por Confirmar'}>
                <i className="bi bi-x-circle"></i>
            </button>
            {
                showModal
                && (
                    <ModalAccionTesoreriaTool options={options}>
                        <div>
                            {optionBtn !== 1 &&(<div className="col-md-12">
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
                            </div>)}
                            <div className="d-flex justify-content-center mt-2">
                                {
                                    optionBtn === 1 && (
                                        <button type="button" className={`btn btn-danger me-2`} onClick={options.closeCustomModal}>
                                            <i className='bi bi-x-circle me-2'></i>
                                            CANCELAR
                                        </button>
                                    )
                                }
                                <button type="button" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                        onClick={handleSubmit(onEnvioValores)}>
                                    <i className={(optionBtn === 1) ? 'bi bi-check-circle me-2' : 'bi bi-x-circle me-2'}></i>
                                    {optionBtn === 1 ? 'ACEPTAR' : 'RECHAZAR'}
                                </button>
                            </div>
                        </div>
                    </ModalAccionTesoreriaTool>
                )}
        </td>
    );
}