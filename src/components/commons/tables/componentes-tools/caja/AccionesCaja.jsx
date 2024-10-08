import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {
    encryptRequest,
    obtenerObjetoDenominaciones, OPTIONS,
    validarAlfaNumerico
} from "../../../../../utils";
import {accionesCaja, getDenominacionesCaja} from "../../../../../services/tools-services";
import {toast} from "react-toastify";
import {ModalAccionesTool} from "../../../modals";
import {DenominacionTableCaja} from "../../../../operacion/denominacion";
import {ModalLoading} from "../../../modals/ModalLoading";

export const AccionesCaja = ({item, index, refresh}) => {

    const [showModal, setShowModal] = useState(false);
    const [guarda, setGuarda] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}, reset
        , watch,setValue
    } = useForm();
    const [optionBtn, setOptionBtn] = useState(1);
    const [habilita, setHabilita] = useState({
        recibe: true,
        entrega: true,
    });
    const [data,setData] = useState([]);

    /*Aqui se diferencia entre un boton de aceptar y otro de rechazar*/
    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }
    const onEnvioValores = async () => {
        setGuarda(true);
        const values = {
            id_operacion: item.ID,
            estatus: (optionBtn === 1) ? 'Aceptado' : 'Rechazado',
            motivo: watch("motivo"),
            usuario: item.Caja,
            usuario_envia: item['Usuario Envia'],
            sucursal: item["Sucursal Envia"],
            noCliente:'',
            diferencia:0,
            traspaso:'',
            ticket: item["No Movimiento"],
            monto: item.Monto,
            moneda: item.Moneda,
        }

        const denominaciones = obtenerObjetoDenominaciones(data.result_set);
        denominaciones.divisa = values.moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'DOTACION CAJA';

        values.denominacion = [
            denominaciones,
        ]

        const encryptedData = encryptRequest(values);

       const response = await accionesCaja(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
            setGuarda(false);
        }
    }

    const options = {
        showModal,
        closeModal: () => {setShowModal(false); reset()},
        title: (optionBtn === 1) ? 'ACEPTAR DOTACIÓN' : 'RECHAZAR DOTACIÓN',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn === 1) ? 'Favor de validar las denominaciones recibidas.'
            : 'Ingresa el motivo por el cual rechazas la dotación.',
    };

    const optionsLoad = {
        showModal: guarda,
        title: `${ optionBtn === 1 ? "Aceptando dotación":"Rechazando dotación"} ...`,
    };

    useEffect(() => {
        const getDenominacionesAsignadas =  async () => {
            const valores = {
                ticket: item["No Movimiento"]
            }
            const encryptedData = encryptRequest(valores);
            const data_denominacion = await getDenominacionesCaja(encryptedData);
            setData(data_denominacion);
        }
        getDenominacionesAsignadas();
    }, [item["No Movimiento"]]);

    return (
        <td key={index} className="text-center">
            <button className="btn btn-primary me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Aceptar"
                    onClick={() => onHandleOptions(1)} disabled={item.Estatus !== 'Pendiente'}>
                <i className="bi bi-check-circle"></i>
            </button>
            <button className="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Rechazar"
                    onClick={() => onHandleOptions(2)} disabled={item.Estatus !== 'Pendiente'}>
                <i className="bi bi-x-circle"></i>
            </button>
            {
                showModal
                && (
                    <ModalAccionesTool options={options}>
                        <form>
                            {
                                optionBtn === 1 && (
                                    <div className="row">
                                        <div className="col-md-12">
                                            <DenominacionTableCaja data={data.result_set} monto={item.Monto} moneda={item.Moneda}/>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                optionBtn === 2 && (<div className="col-md-12">
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
                            <div className="d-flex justify-content-end mt-2">
                                <button type="button" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                        onClick={handleSubmit(onEnvioValores)}
                                        disabled={watch("motivo") === ''}>
                                    <i className={(optionBtn === 1) ? 'bi bi-check-circle m-2' : 'bi bi-x-circle m-2'}></i>
                                    {optionBtn === 1 ? 'ACEPTAR' : 'RECHAZAR'}
                                </button>
                            </div>
                            {guarda && <ModalLoading options={optionsLoad}/>}
                        </form>
                    </ModalAccionesTool>
                )}
        </td>);
}