/*Herramienta para mostrar las acciones del tesorero (Aceptar o rechazar)*/
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest,
    getDenominacion, obtenerObjetoDenominaciones,
    validarAlfaNumerico,
} from "../../../../../utils";
import {ModalAccionTesoreriaTool} from "../../../modals";
import {toast} from "react-toastify";
import {accionesSucursal,} from "../../../../../services/tools-services";
import {useContext, useState} from "react";
import {useForm} from "react-hook-form";
import {Denominacion} from "../../../../operacion/denominacion";
import {DenominacionContext} from "../../../../../context/denominacion/DenominacionContext";

export const AccionesSucursales = ({item, index, refresh}) => {

    const [showModal, setShowModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}, reset
        , watch
    } = useForm();
    const [optionBtn, setOptionBtn] = useState(1);
    const [habilita, setHabilita] = useState({
        recibe: true,
        entrega: true,
    });

    const {denominacionD} = useContext(DenominacionContext);

    const optionsDenominacion = {
        title: `Moneda ${item.Moneda}`,
        importe: parseFloat(item.Monto).toFixed(2),
        habilita,
        setHabilita,
    }

    /*Aqui se diferencia entre un boton de aceptar y otro de rechazar*/
    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }
    const onEnvioValores = async (data) => {

        console.log("DATA:",data);

        const values = {
            id_operacion: item.ID,
            operacion:item.Operacion,
            ticket: item['No Movimiento'],
            estatus: (optionBtn === 1) ? 'Aceptado' : 'Rechazado',
            motivo: watch("motivo"),
            usuario: item.Usuario,
            sucursal: item.Sucursal,
            monto: item.Monto,
            moneda: item.Moneda,
        }

        values.noCliente='0';
        values.traspaso='';

        let denominacionesDotacion = denominacionD.getValues();
        const formValuesD = getDenominacion(values.moneda,denominacionesDotacion)
        eliminarDenominacionesConCantidadCero(formValuesD);
        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = values.moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'DOTACION SUCURSAL';
        values.denominacion = [
            denominaciones,
        ]

        console.log("VALUES:",values);

        const encryptedData = encryptRequest(values);

        const response = await accionesSucursal(encryptedData);

        if (response !== '') {
            toast.success(response, {
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
            denominacionD.reset()
        }
    }

    const options = {
        showModal,
        closeCustomModal: () => setShowModal(false),
        title: (optionBtn === 1) ? 'Aceptar Operación' : 'Rechazar Operación',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn === 1) ? 'Favor de capturar el motivo y las denominaciones recibidas.'
            : 'Ingresa el motivo por el cual rechazas el movimiento.',
    };


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
                    <ModalAccionTesoreriaTool options={options}>
                        <form onSubmit={handleSubmit(onEnvioValores)} noValidate>
                            {
                                optionBtn === 1 && (
                                    <div className="row">
                                        <div className="col-md-6 mt-5">
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
                                                        height: '350px',
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
                                        <div className="col-md-6">
                                            <h5 className="text-center">Monto recibido: <strong>{item.Monto}</strong> </h5>
                                            <Denominacion type="D" moneda={item.Moneda} options={optionsDenominacion}/>
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
                                </div>)
                            }
                            <div className="d-flex justify-content-end mt-2">
                                <button type="submit" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                        disabled={watch("motivo") === '' || denominacionD === undefined}>
                                    <i className={(optionBtn === 1) ? 'bi bi-check-circle m-2' : 'bi bi-x-circle m-2'}></i>
                                    {optionBtn === 1 ? 'Aceptar' : 'Rechazar'}
                                </button>
                            </div>
                        </form>
                    </ModalAccionTesoreriaTool>
                )}
        </td>
    );
}