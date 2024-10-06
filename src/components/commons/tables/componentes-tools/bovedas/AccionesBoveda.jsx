/*Herramienta para mostrar las acciones del tesorero (Aceptar o rechazar)*/
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest, FormatoMoneda, getDenominacion, obtenerObjetoDenominaciones, OPTIONS,
    validarAlfaNumerico, validarMoneda,
} from "../../../../../utils";
import { ModalGenericTool} from "../../../modals";
import {
    getDenominacionesBoveda,
} from "../../../../../services/tools-services";
import { useEffect, useState} from "react";
import {useForm} from "react-hook-form";

import {DenominacionTable} from "../../../../operacion/denominacion";
import {dataG} from "../../../../../App";
import {ModalLoading} from "../../../modals/ModalLoading";
import {accionesSolicitudBoveda} from "../../../../../services/operacion-logistica";
import {toast} from "react-toastify";
import {useCatalogo} from "../../../../../hook";

export const AccionesBoveda = ({item, index,refresh}) => {

    const [showModal, setShowModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}, reset
        , watch,
        trigger,
        setValue
    } = useForm();
    const [optionBtn, setOptionBtn] = useState(1);
    const [datosDenominacion,setDatosDenominacion] = useState([]);
    const [myDenominacion,setDenominacion] = useState({});
    const [totalMonto, setTotalMonto] = useState(0);
    const [guarda,setGuarda] = useState(false);
    const [resetear,setResetear] = useState(false);

    const catalogo = useCatalogo([28,32]);


    /*Aqui se diferencia entre un boton de aceptar y otro de rechazar*/
    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }

    const resetea = () => setResetear(true);

    const onEnvioValores = async (data) => {
        setGuarda(true)
        const values = {
            ID: item.ID,
            accion: (optionBtn === 1) ? 'En transito' : 'Rechazado',
            moneda: item.Divisa,
            motivo: watch("motivo"),
            operacion: 'DOTACION BOVEDA',
            ticket: item['No Movimiento'],
            usuario: dataG.usuario,
            tipo_cambio: parseFloat(data.tipo_cambio),
        }

        if(watch("tipo_movimiento") === 'Cuenta Bancaria'){
            values.tipo_banco = data.tipo_banco;
            values.factura= data.factura;
        }else{
            values.tipo_banco = 'EFECTIVO';
            values.factura= 'EFECTIVO';
        }

        if(Object.values(myDenominacion).length !== 0){
        // Combina los objetos en uno solo
        const objetoCombinado = myDenominacion.reduce((resultado, objeto) => {
            for (const key in objeto) {
                resultado[key] = objeto[key];
            }
            return resultado;
        }, {});
        const formValuesB = getDenominacion(item.Divisa,objetoCombinado)
        eliminarDenominacionesConCantidadCero(formValuesB);
        const denominaciones = obtenerObjetoDenominaciones(formValuesB);
        denominaciones.divisa = item.Divisa;
        denominaciones.movimiento = 'CONFIRMA BOVEDA';

        values.denominacion = [
            denominaciones,
        ]
        }

        const encryptedData = encryptRequest(values);
        const resultado = await accionesSolicitudBoveda(encryptedData);

        if(resultado){
            setGuarda(false);
            toast.success(resultado,OPTIONS);
            setShowModal(false)
        }else {
            toast.error('Hubo un problema con la solicitud, intentelo de nuevo o más tarde.',OPTIONS);
        }
        reset();
        resetea();
        refresh();
    }

    const options = {
        size:'xl',
        showModal,
        closeModal: () => {
            setShowModal(false);
            reset();
        },
        title: (optionBtn === 1) ? 'Confirmar Envío de Dotación a Bóveda' : 'Rechazar Envío de Dotación de Bóveda',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn !== 1) ? 'Ingresa el motivo por el cual rechazas el envío de la dotación a la bóveda.':
            `${item.Divisa !== 'MXP' ? `Ingresa los siguientes datos para confirmar el envío de la dotación por la cantidad de ${FormatoMoneda(parseFloat(item["Monto Solicitado"]))} en ${item.Divisa}.`
                :`Ingresa los siguientes datos para confirmar el envío de la dotación por la cantidad de ${FormatoMoneda(parseFloat(item["Monto Solicitado"]))} en MXP.`}`,
    };

    useEffect(() => {
        const getDenominacionesAsignadas =  async () => {
            const valores = {
                divisa: item.Divisa,
                ticket: item["No Movimiento"]
            }
            const encryptedData = encryptRequest(valores);
            const data_denominacion = await getDenominacionesBoveda(encryptedData)
            setDatosDenominacion(data_denominacion);
        }
        getDenominacionesAsignadas();
    }, [ item.Divisa,item["No Movimiento"]]);

    const validaBtn = () => {
        if(optionBtn === 1){
            return watch("motivo") === '' || parseFloat(item["Monto Solicitado"]) !== parseFloat(totalMonto);
        }else {
            return watch("motivo") === '';
        }
    }

    const optionsLoad = {
        showModal: guarda,
        title: `${optionBtn === 1 ? 'Confirmando Envío de Dotación a boveda...': 'Rechazando Envío de Dotación a boveda...'}`,
    };

    const [tipoBancoError, setTipoBancoError] = useState(false);

    useEffect(() => {
        // Validar al montar el componente
        const bancoValue = watch("tipo_banco");
        const isValid = bancoValue !== "";
        setTipoBancoError(!isValid);
    }, [watch("tipo_banco")]);


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
                    <ModalGenericTool options={options}>
                        <div>
                            {optionBtn !== 1 && (
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
                                            minHeight: '100%',
                                            resize: 'none'
                                        }}
                                        tabIndex="1"
                                    />
                                    <label htmlFor="motivo">MOTIVO</label>
                                    {
                                        errors?.motivo &&
                                        <div className="invalid-feedback-custom">{errors?.motivo.message}</div>
                                    }
                                </div>
                            </div>
                            )}
                            {
                                (optionBtn === 1) && (
                                    <div className="d-flex justify-content-center">
                                        <div className="row ">
                                            {
                                                item.Divisa !== 'MXP' ?
                                                (<div className="col-3">
                                                    <div className="container justify-content-center align-items-center mt-4">
                                                        <div className="col-md-12">
                                                            <div className="form-floating mb-3">
                                                                <select
                                                                    {...register("tipo_movimiento", {
                                                                        required: {
                                                                            value: true,
                                                                            message: "Debes de seleccionar al menos una tipo de movimiento.",
                                                                        },
                                                                        validate: (value) => {
                                                                            return (
                                                                                value !== "0" || "Debes seleccionar una tipo de movimiento válido."
                                                                            );
                                                                        },
                                                                    })}
                                                                    className={`form-select ${!!errors?.tipo_movimiento ? "invalid-input" : ""}`}
                                                                    id="tipo_movimiento"
                                                                    name="tipo_movimiento"
                                                                    aria-label="tipo_movimiento"
                                                                >
                                                                    <option value="">SELECCIONA UNA OPCIÓN</option>
                                                                    {catalogo[1]?.map((ele) => (
                                                                        <option
                                                                            key={ele.id + "-" + ele.descripcion}
                                                                            value={ele.id}
                                                                        >
                                                                            {ele.descripcion}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <label htmlFor="tipo_movimiento">TIPO DE MOVIMIENTO</label>
                                                                {errors?.tipo_movimiento && (
                                                                    <div className="invalid-feedback-custom">
                                                                        {errors?.tipo_movimiento.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 form-floating mb-3">
                                                        <input
                                                            {...register("tipo_cambio", {
                                                                required: {
                                                                    value: true,
                                                                    message: 'Debes de ingresar un tipo de cambio.'
                                                                },
                                                                validate: {
                                                                    moneda: (value) => validarMoneda(`Tipo de Cambio`, value),
                                                                },
                                                            })}
                                                            type="text"
                                                            className={`form-control ${errors && errors.tipo_cambio ? "is-invalid" : ""}`}
                                                            name='tipo_cambio'
                                                            placeholder="$"
                                                            autoComplete="off"
                                                            tabIndex="1"
                                                            onChange={(e) => {
                                                                // Actualiza el valor del campo de entrada
                                                                e.preventDefault();
                                                                setValue("tipo_cambio", e.target.value);
                                                                trigger("tipo_cambio")
                                                            }}
                                                        />
                                                        <label htmlFor="tipo_cambio">TIPO DE CAMBIO</label>
                                                        {errors && errors.tipo_cambio && (
                                                            <div className="invalid-feedback">
                                                                {errors.tipo_cambio.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                        { watch("tipo_movimiento") === 'Cuenta Bancaria' &&
                                                            (<><div className="col-md-12">
                                                            <div className="form-floating mb-3">
                                                                <select
                                                                    {...register("tipo_banco", {
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Debes de seleccionar al menos un banco.'
                                                                        },
                                                                        validate: value => {
                                                                            const isValid = value !== "";
                                                                            setTipoBancoError(!isValid);
                                                                            return isValid || 'Debes seleccionar un banco válido.';
                                                                        }
                                                                    })}
                                                                    className={`form-select ${tipoBancoError ? 'invalid-input' : ''}`}
                                                                    id="tipo_banco"
                                                                    name="tipo_banco"
                                                                    aria-label="Banco/Casa de Cambio"
                                                                    tabIndex="2"
                                                                    onChange={()=>{
                                                                        trigger('tipo_banco')
                                                                    }}
                                                                >
                                                                    <option value="">SELECCIONA UNA OPCIÓN</option>
                                                                    {
                                                                        catalogo[0]?.map((ele) => (
                                                                            <option key={ele.Id + '-' + ele.descripcion}
                                                                                    value={ele.descripcion}>
                                                                                {ele.descripcion}
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                <label htmlFor="tipo_banco">BANCO/CASA DE CAMBIO</label>
                                                                {
                                                                    tipoBancoError  && <div
                                                                        className="invalid-feedback-custom">Debes seleccionar un banco válido.</div>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 form-floating mb-3">
                                                            <input
                                                                {...register("factura", {
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Debes de ingresar un número de factura valido.'
                                                                    },
                                                                    minLength:{
                                                                        value:1,
                                                                        message:'El número de factura debe de tener al menos 1 caracter.'
                                                                    },
                                                                    maxLength:{
                                                                        value:10,
                                                                        message:'El número de factura debe de tener como máximo 10 caracteres.'
                                                                    },
                                                                    validate: {
                                                                        moneda: (value) => validarAlfaNumerico(`Numero de Factura`, value),
                                                                    },
                                                                })}
                                                                type="text"
                                                                className={`form-control ${errors && errors.factura ? "is-invalid" : ""}`}
                                                                name='factura'
                                                                placeholder="Ingresa el numero de factura"
                                                                onChange={(e) => {
                                                                    const upperCaseValue = e.target.value.toUpperCase();
                                                                    e.target.value = upperCaseValue;
                                                                    setValue("factura", upperCaseValue);
                                                                }}
                                                                autoComplete="off"
                                                                tabIndex="3"
                                                            />
                                                            <label htmlFor="factura">NÚMERO DE FACTURA</label>
                                                            {errors && errors.factura && (
                                                                <div className="invalid-feedback">
                                                                    {errors.factura.message}
                                                                </div>
                                                            )}
                                                        </div></>)}
                                                    </div>
                                                </div>
                                                ): (
                                                    <div className="col-3">
                                                        <div className="container justify-content-center align-items-center mt-4">
                                                            <div className="col-md-12">
                                                                <div className="form-floating mb-3">
                                                                    <select
                                                                        {...register("tipo_movimiento", {
                                                                            required: {
                                                                                value: true,
                                                                                message: "Debes de seleccionar al menos una tipo de movimiento.",
                                                                            },
                                                                            validate: (value) => {
                                                                                return (
                                                                                    value !== "0" || "Debes seleccionar una tipo de movimiento válido."
                                                                                );
                                                                            },
                                                                        })}
                                                                        className={`form-select ${!!errors?.tipo_movimiento ? "invalid-input" : ""}`}
                                                                        id="tipo_movimiento"
                                                                        name="tipo_movimiento"
                                                                        aria-label="tipo_movimiento"
                                                                    >
                                                                        <option value="">SELECCIONA UNA OPCIÓN</option>
                                                                        {catalogo[1]?.map((ele) => (
                                                                            <option
                                                                                key={ele.id + "-" + ele.descripcion}
                                                                                value={ele.id}
                                                                            >
                                                                                {ele.descripcion}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <label htmlFor="tipo_movimiento">TIPO DE MOVIMIENTO</label>
                                                                    {errors?.tipo_movimiento && (
                                                                        <div className="invalid-feedback-custom">
                                                                            {errors?.tipo_movimiento.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-floating mb-3">
                                                                    <select
                                                                        {...register("tipo_banco", {
                                                                            required: {
                                                                                value: true,
                                                                                message: 'Debes de seleccionar al menos un banco.'
                                                                            },
                                                                            validate: value => {
                                                                                const isValid = value !== "";
                                                                                setTipoBancoError(!isValid);
                                                                                return isValid || 'Debes seleccionar un banco válido.';
                                                                            }
                                                                        })}
                                                                        className={`form-select ${tipoBancoError ? 'invalid-input' : ''}`}
                                                                        id="tipo_banco"
                                                                        name="tipo_banco"
                                                                        aria-label="Banco/Casa de Cambio"
                                                                        tabIndex="1"
                                                                        onChange={()=>{
                                                                            trigger('tipo_banco')
                                                                        }}
                                                                    >
                                                                        <option value="">SELECCIONA UNA OPCIÓN</option>
                                                                        {
                                                                            catalogo[0]?.map((ele) => (
                                                                                <option key={ele.Id + '-' + ele.descripcion}
                                                                                        value={ele.descripcion}>
                                                                                    {ele.descripcion}
                                                                                </option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                    <label htmlFor="tipo_banco">BANCO/CASA DE CAMBIO</label>
                                                                    {
                                                                        tipoBancoError  && <div
                                                                            className="invalid-feedback-custom">Debes seleccionar un banco válido.</div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12 form-floating mb-3">
                                                                <input
                                                                    {...register("factura", {
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Debes de ingresar un número de referencia valido.'
                                                                        },
                                                                        minLength:{
                                                                            value:1,
                                                                            message:'El número de referencia debe de tener al menos 1 caracter.'
                                                                        },
                                                                        maxLength:{
                                                                            value:30,
                                                                            message:'El número de factura debe de tener como máximo 30 caracteres.'
                                                                        },
                                                                        validate: {
                                                                            moneda: (value) => validarAlfaNumerico(`Numero de Referencia`, value),
                                                                        },
                                                                    })}
                                                                    type="text"
                                                                    className={`form-control ${errors && errors.factura ? "is-invalid" : ""}`}
                                                                    name='factura'
                                                                    placeholder="Ingresa el numero de referencia"
                                                                    onChange={(e) => {
                                                                        const upperCaseValue = e.target.value.toUpperCase();
                                                                        e.target.value = upperCaseValue;
                                                                        setValue("factura", upperCaseValue);
                                                                    }}
                                                                    autoComplete="off"
                                                                    tabIndex="2"
                                                                />
                                                                <label htmlFor="factura">NÚMERO DE REFERENCIA</label>
                                                                {errors && errors.factura && (
                                                                    <div className="invalid-feedback">
                                                                        {errors.factura.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            <div className="col-md-9">
                                                <DenominacionTable setDenominacion={setDenominacion}
                                                                   moneda={item.Divisa}
                                                                   data={datosDenominacion.result_set}
                                                                   monto={parseFloat(item["Monto Solicitado"])}
                                                                   setTotalMonto={setTotalMonto}
                                                                   resetea={resetear}
                                                                   boveda
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="d-flex justify-content-center mt-2">
                                {
                                    optionBtn === 1 && (
                                        <button type="button" className={`btn btn-danger me-2`} onClick={options.closeModal}>
                                            <i className='bi bi-x-circle me-2'></i>
                                            CANCELAR
                                        </button>
                                    )
                                }
                                <button type="button" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                        disabled={validaBtn()}
                                        onClick={handleSubmit(onEnvioValores)}>
                                    <i className={(optionBtn === 1) ? 'bi bi-check-circle me-2' : 'bi bi-x-circle me-2'}></i>
                                    {optionBtn === 1 ? 'CONFIRMAR ENVIO' : 'RECHAZAR ENVIO'}
                                </button>
                            </div>
                        </div>
                    </ModalGenericTool>
                )}
            {guarda && <ModalLoading options={optionsLoad}/>}
        </td>
    );
}