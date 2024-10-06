/*Herramienta para mostrar las acciones del tesorero (Aceptar o rechazar)*/
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest, FormatoMoneda,
    getDenominacion, obtenerObjetoDenominaciones, OPTIONS,
    validarAlfaNumerico,
} from "../../../../../utils";
import {ModalAccionTesoreriaTool} from "../../../modals";
import {toast} from "react-toastify";
import {accionesSucursal, getDenominaciones,} from "../../../../../services/tools-services";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Denominacion, DenominacionTableCaja} from "../../../../operacion/denominacion";
import {DenominacionContext} from "../../../../../context/denominacion/DenominacionContext";
import {DenominacionTable} from "../../../../operacion/denominacion/DenominacionTable";
import {ModalLoading} from "../../../modals/ModalLoading";
import {dataG} from "../../../../../App";
import {obtieneDenominacionesNota} from "../../../../../services";

export const AccionesSucursales = ({item, index, refresh}) => {
    const [guarda, setGuarda] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [totalMonto, setTotalMonto] = useState(0);
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,reset
        , watch
    } = useForm();
    const [optionBtn, setOptionBtn] = useState(1);
    const [habilita, setHabilita] = useState({
        recibe: true,
        entrega: true,
    });
    const [datosDenominacion,setDatosDenominacion] = useState([]);
    const [myDenominacion,setDenominacion] = useState({});

    const {denominacionD} = useContext(DenominacionContext);

    const optionsDenominacion = {
        title: `Moneda ${item.Moneda}`,
        importe: parseFloat(item.Monto),
        habilita,
        setHabilita,
        setTotalMonto,
        item,
    }

    const optionsLoad = {
        showModal: guarda,
        title: `${ optionBtn === 1 ? "Aceptando dotación":"Rechazando dotación"} ...`,
    };

    /*Aqui se diferencia entre un boton de aceptar y otro de rechazar*/
    const onHandleOptions = (option) => {
        setOptionBtn(option);
        setShowModal(true);
    }
    const onEnvioValores = async (data) => {
        setGuarda(true);
        const values = {
            id_operacion: item.ID,
            operacion:item.Operacion,
            ticket: item['No Movimiento'],
            estatus: (optionBtn === 1) ? 'Aceptado' : 'Rechazado',
            motivo: watch("motivo") | "",
            usuario: item.Usuario,
            usuario_envia: dataG.usuario,
            sucursal: item.Sucursal,
            monto: item.Monto,
            moneda: item.Moneda,
        }

        values.noCliente='0';
        values.traspaso='';

        let denominaciones=[];

        if(item.Operacion === 'Dotación Sucursal' && optionBtn === 1){
            // Combina los objetos en uno solo
            const objetoCombinado = myDenominacion.reduce((resultado, objeto) => {
                for (const key in objeto) {
                    resultado[key] = objeto[key];
                }
                return resultado;
            }, {});

            const formValuesD = getDenominacion(values.moneda,objetoCombinado)
            eliminarDenominacionesConCantidadCero(formValuesD);
            denominaciones = obtenerObjetoDenominaciones(formValuesD);
        }else{
            let denominacionesDotacion = denominacionD.getValues();
            const formValuesD = getDenominacion(values.moneda,denominacionesDotacion)
            eliminarDenominacionesConCantidadCero(formValuesD);
            denominaciones = obtenerObjetoDenominaciones(formValuesD);
        }
        denominaciones.divisa = values.moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'DOTACION SUCURSAL';

        values.denominacion = [
            denominaciones,
        ]

        const encryptedData = encryptRequest(values);

        const response = await accionesSucursal(encryptedData);

        if (response !== '') {
            setGuarda(false);
            toast.success(response, OPTIONS);
            setShowModal(false);
            refresh();
            reset();
            denominacionD.reset()
        }
    }

    const options = {
        showModal,
        closeModal: () => {
            setShowModal(false);
            setValue("motivo",'');
        },
        title: (optionBtn === 1) ? 'Aceptar Operación' : 'Rechazar Operación',
        icon: (optionBtn === 1) ? 'bi bi-check-circle m-2 text-success' : 'bi bi-x-circle m-2 text-danger',
        subtitle: (optionBtn === 1) ?  item.Operacion !== 'CIERRE' ? 'Favor de capturar las denominaciones recibidas.':'Favor de validar las denominaciones del cierre de caja.'
            : 'Ingresa el motivo por el cual rechazas el movimiento.',
    };


    useEffect(() => {
        const getDenominacionesAsignadas =  async () => {

            let data_denominacion =  {};
            const valores = {
                    divisa: item.Moneda,
                    ticket: item["No Movimiento"]
            }
            const encryptedData = encryptRequest(valores);
            data_denominacion = await getDenominaciones(encryptedData)
            setDatosDenominacion(data_denominacion);
        }

        const getDenominacionesCierre =  async () => {
            const valores = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
                moneda: item.Moneda,
                tipo_movimiento: 'C',
                no_movimiento: item["No Movimiento"]
            }
            const encryptedData = encryptRequest(valores);
            const data_denominacion = await obtieneDenominacionesNota(encryptedData);
            setDatosDenominacion(data_denominacion);
        }

        const getDenominacionesNota =  async () => {
            const valores = {
                usuario: dataG.usuario,
                sucursal: item.Sucursal || dataG.sucursal,
                moneda: item.Moneda,
                tipo_movimiento: 'CNC',
                no_movimiento: item["No Movimiento"]
            }
            const encryptedData = encryptRequest(valores);
            const data_denominacion = await obtieneDenominacionesNota(encryptedData);
            setDatosDenominacion(data_denominacion);
        }


        if(item.Operacion === 'Dotación Sucursal'){
            getDenominacionesAsignadas();
        }else if(item.Operacion === 'CIERRE'){
            getDenominacionesCierre();
        }else if(item.Operacion === 'Nota de Credito'){
            getDenominacionesNota();
        }
    }, [item.Moneda,item["No Movimiento"]]);

    const validaBtn = () => {
        if(optionBtn === 1){
            if(item.Operacion === 'Dotación Sucursal'){
                return parseFloat(item.Monto) !== parseFloat(totalMonto);
            }else if(item.Operacion === 'CIERRE'){
              return false;
            }else{
                return watch("motivo") === '';
            }
        }else {
            return watch("motivo") === '';
        }
    }


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
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h5 className="text-center">Monto recibido: <strong>{FormatoMoneda(parseFloat(item.Monto))}</strong> </h5>
                                            {
                                                item.Operacion === 'Nota de Credito' && dataG.id_perfil !== 3
                                                    ? (<Denominacion
                                                            type={item.Operacion === 'Dotación Sucursal' ? 'D':item.Operacion === 'Nota de Credito' ? 'CNC' :'C'}
                                                            moneda={item.Moneda}
                                                            options={optionsDenominacion}
                                                    />)
                                                    : item.Operacion === 'Dotación Sucursal'
                                                        ? (<DenominacionTable
                                                            setDenominacion={setDenominacion}
                                                            moneda={item.Moneda}
                                                            data={datosDenominacion.result_set}
                                                            monto={item.Monto}
                                                            setTotalMonto={setTotalMonto}
                                                        />)
                                                        : (<DenominacionTableCaja
                                                                moneda={item.Moneda}
                                                                data={datosDenominacion.result_set}
                                                                monto={item.Monto}
                                                        />)
                                            }
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
                                </div>)
                            }
                            <div className="d-flex justify-content-end mt-2">
                                <button type="button" className={`btn ${optionBtn === 1 ? 'btn-success' : 'btn-danger'}`}
                                        disabled={validaBtn()}
                                        onClick={handleSubmit(onEnvioValores)}>
                                    <i className={(optionBtn === 1) ? 'bi bi-check-circle m-2' : 'bi bi-x-circle m-2'}></i>
                                    {optionBtn === 1 ? 'ACEPTAR' : 'RECHAZAR'}
                                </button>
                            </div>
                           {guarda && <ModalLoading options={optionsLoad}/>}
                        </div>
                    </ModalAccionTesoreriaTool>
                )
            }
        </td>
    );
}