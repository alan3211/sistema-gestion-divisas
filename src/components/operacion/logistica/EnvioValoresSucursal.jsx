import {
    eliminarDenominacionesConCantidadCero, encryptRequest, formattedDateWS,
    getDenominacion,
    obtenerObjetoDenominaciones, opciones, OPTIONS,
    validarMoneda
} from "../../../utils";
import {Denominacion} from "../denominacion";

import {useForm} from "react-hook-form";

import {useCatalogo} from "../../../hook";
import {dataG} from "../../../App";
import {useContext, useEffect, useState} from "react";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {realizarOperacionSucursal} from "../../../services/operacion-sucursal";
import {toast} from "react-toastify";
import {ModalLoading} from "../../commons/modals/ModalLoading";
export const EnvioValoresSucursal = () => {

    const {register,handleSubmit
        ,formState:{errors},reset
        ,watch} = useForm()
    const catalogo = useCatalogo([15,17]);
    const [showDenominacion,setShowDenominacion] =  useState(false);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });

    const [finalizaOperacion,setFinalizaOperacion] = useState(true);
    const [guarda, setGuarda] = useState(false);

    const {denominacionD} = useContext(DenominacionContext);

    const options = {
        title: '',
        importe: parseInt(watch('monto')),
        habilita,
        setHabilita,
        setFinalizaOperacion
    }

    const optionsLoad = {
        showModal: guarda,
        closeCustomModal: () => setGuarda(false),
        title: "Enviando solicitud de valores...",
    };

    const terminarDotacion = handleSubmit(async(data)=>{
        setGuarda(true);
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        data.operacion = 'SOLICITA VALORES';
        data.usuario = dataG.usuario;
        data.ticket = `SOLVAL${data.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        data.noCliente='0';
        data.traspaso='';

        let denominacionesDotacion = denominacionD.getValues();
        const formValuesD = getDenominacion(data.moneda,denominacionesDotacion)
        eliminarDenominacionesConCantidadCero(formValuesD);
        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = data.moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'ENVIA VALORES';

        data.denominacion = [
            denominaciones,
        ]

        const encryptedData = encryptRequest(data);

        const resultado = await realizarOperacionSucursal(encryptedData);

        if(resultado){
            reset();
            setShowDenominacion(false);
            denominacionD.reset();
            setGuarda(false);
            toast.success(resultado,OPTIONS);
        }
    });

    const nuevoEnvio = () => {
        setShowDenominacion(false);
        reset();
        denominacionD.reset();
    }

    useEffect(() => {
        if(watch("moneda") === '0'){
            setShowDenominacion(false);
        }else{
            setShowDenominacion(true);
        }
    }, [watch("moneda")]);

    return (
        <form className="row m-1 g-3 justify-content-center">
            <div className="col-md-3">
                <div className="form-floating mb-3">
                    <select
                        {...register("sucursal", {
                            required: {
                                value: true,
                                message: "Debes de seleccionar al menos una sucursal.",
                            },
                            validate: (value) => {
                                return (
                                    value !== "0" || "Debes seleccionar una sucursal válida."
                                );
                            },
                        })}
                        className={`form-select ${!!errors?.sucursal ? "invalid-input" : ""}`}
                        id="sucursal"
                        name="sucursal"
                        aria-label="Sucursal"
                    >
                        <option value="0">SELECCIONA UNA OPCIÓN</option>
                        {catalogo[1]?.map((ele) => (
                            <option
                                key={ele.id + "-" + ele.descripcion}
                                value={ele.id}
                            >
                                {ele.descripcion}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="sucursal">SUCURSAL</label>
                    {errors?.sucursal && (
                        <div className="invalid-feedback-custom">
                            {errors?.sucursal.message}
                        </div>
                    )}
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-floating">
                    <input
                        {...register("monto",{
                            required:{
                                value:true,
                                message:'El campo Monto no puede ser vacio.'
                            },
                            validate: {
                                validacionMN: (value) => validarMoneda("Monto",value),
                                mayorACero: value => parseFloat(value) > 0 || "El Monto debe ser mayor a 0",
                            }
                        })}
                        type="text"
                        className={`form-control ${!!errors?.monto ? 'invalid-input':''}`}
                        id="monto"
                        name="monto"
                        placeholder="Ingresa el monto"
                        autoComplete="off"
                    />
                    <label htmlFor="monto">MONTO</label>
                    {
                        errors?.monto && <div className="invalid-feedback-custom">{errors?.monto.message}</div>
                    }
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-floating mb-3">
                    <select
                        {...register("moneda",{
                            required:{
                                value:true,
                                message:'Debes de seleccionar al menos un tipo de moneda.'
                            },
                            validate: value => {
                                return value !== "0" || 'Debes seleccionar un tipo de moneda válido.';
                            }
                        })}
                        className={`form-select ${!!errors?.moneda ? 'invalid-input':''}`}
                        id="moneda"
                        name="moneda"
                        aria-label="Moneda"
                    >
                        <option value="0">SELECCIONA UNA OPCIÓN</option>
                        {
                            catalogo[0]?.map((ele) => (
                                <option key={ele.id + '-' + ele.descripcion}
                                        value={ele.id}>
                                    {ele.descripcion}
                                </option>
                            ))
                        }
                    </select>
                    <label htmlFor="moneda">MONEDA</label>
                    {
                        errors?.moneda && <div className="invalid-feedback-custom">{errors?.moneda.message}</div>
                    }
                </div>
            </div>
            <div className="d-flex justify-content-center">
                {
                    showDenominacion && <Denominacion type="D" moneda={watch('moneda')} options={options}/>
                }
            </div>
            <div className="col-md-12 d-flex justify-content-center">
                <button className="btn btn-secondary me-3" onClick={nuevoEnvio}>
                    <i className="bi bi-box-arrow-up-right"></i> NUEVO ENVÍO
                </button>
                <button type="button" className="btn btn-primary"
                        onClick={terminarDotacion} disabled={finalizaOperacion}>
                    <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                   FINALIZAR OPERACIÓN
                </button>
            </div>
            {guarda && <ModalLoading options={optionsLoad}/>}
        </form>
    );
}