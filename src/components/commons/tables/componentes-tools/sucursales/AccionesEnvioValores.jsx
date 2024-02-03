/*Herramienta para mostrar las acciones del tesorero (Aceptar o rechazar)*/
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {ModalGenericTool} from "../../../modals";
import {useForm} from "react-hook-form";
import {encryptRequest, OPTIONS, validarAlfaNumerico} from "../../../../../utils";
import {
    accionesSolicitudValores,
    accionesTesoreria,
    obtieneDenominacionesSolicitadas
} from "../../../../../services/tools-services";
import {dataG} from "../../../../../App";
import {DenominacionTableCaja} from "../../../../operacion/denominacion";

export const AccionesEnvioValores = ({item, index, refresh}) => {

    const [showModal, setShowModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}, reset
        , watch,setValue
    } = useForm();
    const [optionBtn, setOptionBtn] = useState(1);
    const [dataDenominacion, setDataDenominacion] = useState([]);

    /*Aqui se diferencia entre un boton de aceptar y otro de rechazar*/
    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }
    const handleConfirmaValores = handleSubmit(async (data) => {
        data.ticket = item['No Movimiento'];
        data.estatus = "En transito";
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

    const handleRechazarEnvio = handleSubmit(async (data) => {
        data.ticket = item['No Movimiento'];
        data.estatus = "Rechazado";
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
        size:'xl',
        showModal,
        closeModal: () => setShowModal(false),
        title:  (optionBtn === 1) ? 'Confirmación de Valores' :'Rechazar Envio de Solicitud de Valores',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn === 1) ? 'Valide las denominaciones solicitadas.':'Ingrese el motivo por el cual desea rechazar la solicitud de valores.',
    };

    useEffect(() => {
        const getDenominacionesSolicitadas = async () => {
            const values = {
                ticket: item['No Movimiento']
            }
            const encryptedData =  encryptRequest(values);
            const response =  await obtieneDenominacionesSolicitadas(encryptedData);
            setDataDenominacion(response.result_set)
        }

        getDenominacionesSolicitadas();
    }, [item['No Movimiento']]);

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
                    <ModalGenericTool options={options}>
                        <div className="row">
                            {
                                optionBtn !== 1 && (<div className='col-md-12'>
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
                            </div>)
                            }
                            {
                                optionBtn === 1 && (
                                    <div className="col-md-12 mb-3">
                                        <DenominacionTableCaja data={dataDenominacion} moneda={item.Moneda} monto={item.Monto}/>
                                    </div>
                                )
                            }
                            <div className="d-flex justify-content-end mt-3">
                                <button type="button" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                        onClick={optionBtn === 1 ? handleConfirmaValores:handleRechazarEnvio}>
                                    <i className={(optionBtn === 1) ? 'bi bi-check-circle m-2' : 'bi bi-x-circle m-2'}></i>
                                    {optionBtn === 1 ? 'ACEPTAR' : 'RECHAZAR'}
                                </button>
                            </div>
                        </div>
                    </ModalGenericTool>
                )
            }
        </td>
    );
}