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
import {FilterComboInput} from "../../commons/inputs/FilterComboInput";
import {LoaderTable} from "../../commons/LoaderTable";
export const EnvioValoresSucursal = () => {

    const propForm = useForm();
    const form = {
        register: propForm.register,
        handleSubmit: propForm.handleSubmit,
        errors: propForm.formState.errors,
        watch: propForm.watch,
        reset: propForm.reset,
        setValue: propForm.setValue,
    }
    const catalogo = useCatalogo([15,17]);
    const [showDenominacion,setShowDenominacion] =  useState(false);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });

    const [finalizaOperacion,setFinalizaOperacion] = useState(true);
    const [guarda, setGuarda] = useState(false);
    const [moneda, setMoneda] = useState('USD')

    const {denominacionD} = useContext(DenominacionContext);

    const options = {
        title: '',
        importe: parseFloat(form.watch('monto')),
        sucursal: form.watch("sucursal"),
        habilita,
        setHabilita,
        setFinalizaOperacion
    }

    const optionsLoad = {
        showModal: guarda,
        closeCustomModal: () => setGuarda(false),
        title: "Enviando solicitud de valores...",
    };

    const terminarDotacion =form.handleSubmit(async(data)=>{
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
            form.reset();
            setShowDenominacion(false);
            denominacionD.reset();
            setGuarda(false);
            toast.success(resultado,OPTIONS);
        }
    });

    const nuevoEnvio = () => {
        setShowDenominacion(false);
        form.reset();
        denominacionD.reset();
    }

    const generaSolicitud = () => {
        setShowDenominacion(true);
        setMoneda(form.watch("moneda"));
    }

    useEffect(() => {
        setShowDenominacion(false);
    }, [form.watch("moneda")]);

    return (
        <form className="row m-1 g-3 justify-content-center">
            <div className="col-md-3">
                <FilterComboInput
                    propFormulario={form}
                    name="sucursal"
                    label="SUCURSAL"
                    options={catalogo[1] || []}
                />
            </div>
            <div className="col-md-3">
                <div className="form-floating">
                    <input
                        {...form.register("monto",{
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
                        className={`form-control ${!!form.errors?.monto ? 'invalid-input':''}`}
                        id="monto"
                        name="monto"
                        placeholder="Ingresa el monto"
                        autoComplete="off"
                    />
                    <label htmlFor="monto">MONTO</label>
                    {
                        form.errors?.monto && <div className="invalid-feedback-custom">{form.errors?.monto.message}</div>
                    }
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-floating mb-3">
                    <select
                        {...form.register("moneda",{
                            required:{
                                value:true,
                                message:'Debes de seleccionar al menos un tipo de moneda.'
                            },
                            validate: value => {
                                return value !== "0" || 'Debes seleccionar un tipo de moneda válido.';
                            }
                        })}
                        className={`form-select ${!!form.errors?.moneda ? 'invalid-input':''}`}
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
                        form. errors?.moneda && <div className="invalid-feedback-custom">{form.errors?.moneda.message}</div>
                    }
                </div>
            </div>
            <div className="col-md-3">
                <button type="button" className="btn btn-primary mt-2"
                        onClick={generaSolicitud}>
                    <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                    GENERAR
                </button>
            </div>
            <div className="d-flex justify-content-center">
                {
                    showDenominacion &&
                    <form>
                        <Denominacion type="D" moneda={moneda} options={options}/>
                    </form>
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