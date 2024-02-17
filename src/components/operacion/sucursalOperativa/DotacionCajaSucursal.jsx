import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";
import {useContext, useEffect, useState} from "react";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest,
    FormatoMoneda,
    formattedDateWS,
    getDenominacion,
    obtenerObjetoDenominaciones,
    opciones,
    OPTIONS,
    validarMoneda, validarMonedaUSD
} from "../../../utils";
import {dataG} from "../../../App";
import {
    cierreCajaAnterior,
    getCantidadDisponible,
    realizarOperacionSucursalDotacion
} from "../../../services/operacion-sucursal";
import {toast} from "react-toastify";
import {Denominacion} from "../denominacion";
import {getUsuariosSistema} from "../../../services";
import {ModalLoading} from "../../commons/modals/ModalLoading";
import {LoaderTable} from "../../commons/LoaderTable";

export const DotacionCajaSucursal = () => {
    const [usuariosCombo,setUsuariosCombo] = useState([]);
    const {register,handleSubmit
        ,formState:{errors},reset,setValue
        ,watch,trigger,} = useForm()
    const catalogo = useCatalogo([15]);
    const [showDenominacion,setShowDenominacion] =  useState(false);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });
    const [showDisponible,setShowDisponible] = useState({
        isAvailable:false,
        cantidad: 0
    })
    const [moneda, setMoneda] = useState('0')
    const [guarda, setGuarda] = useState(false);

    const [finalizaOperacion,setFinalizaOperacion] = useState(true);

    const {denominacionD} = useContext(DenominacionContext);

    const options = {
        title: '',
        importe: parseFloat(watch('monto')),
        habilita,
        setHabilita,
        setFinalizaOperacion,
    }

    const optionsLoad = {
        showModal: guarda,
        title: `Enviando dotación a la cajero ${watch("cajero")} ...`,
    };

    // Validacion del cierre de cajas anterior.
    const validaCierreDeCajasAnterior = async() => {
        const valores = {
            sucursal: dataG.sucursal,
            moneda: watch("moneda")
        }
        console.log("Valores: ",valores)
        const encryptedData = encryptRequest(valores);
        return await cierreCajaAnterior(encryptedData);
    }


    const terminarDotacion = handleSubmit(async(data)=>{

        setGuarda(true);
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        data.operacion = 'Dotacion Caja';
        data.usuario = dataG.usuario;
        data.sucursal = dataG.sucursal;
        data.ticket = `DOTCAJA${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        data.traspaso='';

        let denominacionesDotacion = denominacionD.getValues();
        const formValuesD = getDenominacion(data.moneda,denominacionesDotacion)
        eliminarDenominacionesConCantidadCero(formValuesD);
        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = data.moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'DOTACION CAJA';

        data.denominacion = [
            denominaciones,
        ]

        const encryptedData = encryptRequest(data);

        const resultado = await realizarOperacionSucursalDotacion(encryptedData);

        if(resultado){
            toast.success(`Se ha enviado los valores correctamente de ${data.moneda}`,OPTIONS);
            reset();
            setShowDenominacion(false);
            denominacionD.reset();
            setGuarda(false);
        }
    });

    const nuevoEnvio = () =>  {
        setShowDisponible({
            isAvailable:false,
            cantidad: 0
        })
        setShowDenominacion(false);
        denominacionD.reset();
        setValue("monto",'');
        setValue("moneda",'0');
        setValue("cajero",'0');
    }

    const obtieneUsuarios = async () => {
        const valores = {
            sucursal:dataG.sucursal,
            usuario: dataG.usuario,
        }
        const encryptedData = encryptRequest(valores)
        const data_usuarios = await getUsuariosSistema(encryptedData);
        setUsuariosCombo(data_usuarios);
    }

    const obtieneDisponibilidad = async () => {
        const valores = {
            sucursal: dataG.sucursal,
            divisa: watch("moneda")
        };
        const encryptedData = encryptRequest(valores);
        const disponibilidad = await getCantidadDisponible(encryptedData);

        const montoIngresado = parseFloat(watch("monto")) || 0;
        const disponible = parseFloat(disponibilidad.result_set[0].Disponible) || 0;

        if (montoIngresado === 0) {
            toast.info('El monto ingresado no puede ser cero.', OPTIONS);
            setShowDisponible({
                isAvailable: false,
                cantidad: 0
            });
            setShowDenominacion(false);
        } else if (disponible > 0.0 && montoIngresado <= disponible) {
            setShowDisponible({
                isAvailable: true,
                cantidad: disponible
            });
            setShowDenominacion(true);
        } else {
            toast.info('La cantidad ingresada supera el monto disponible para esta divisa.', OPTIONS);
            setShowDisponible({
                isAvailable: false,
                cantidad: 0
            });
            setShowDenominacion(false);
        }
        console.log(showDisponible);
    };

    useEffect(()=>{
        obtieneUsuarios();
    },[]);

    useEffect(() => {
        setShowDenominacion(false);
        setShowDisponible({
            isAvailable: false,
            cantidad: 0
        });
    }, [watch("moneda")]);

    const consultaDotaciones = async () => {
        console.log("MONEDA");
        console.log(watch("moneda"));
        if(watch("moneda") === '0'){

            setShowDenominacion(false);
            setShowDisponible({
                isAvailable: false,
                cantidad: 0
            });
        }else{
            const mensaje = await validaCierreDeCajasAnterior();
            if (mensaje.includes('cierre de dias anteriores')) {
                toast.warn(mensaje, OPTIONS);
                setShowDenominacion(false);
            } else {
                obtieneDisponibilidad();
                setShowDenominacion(true);
            }
        }
        setMoneda(watch("moneda"));
    }

    const validaMonto = () => {
        let mensaje;
        if (watch("moneda") === 'USD') {
            mensaje = validarMonedaUSD("Monto",watch("monto"));
        } else {
            mensaje = validarMoneda("Monto",watch("monto"));
        }
        return typeof mensaje === 'string'
    }


    return (<>
        <form className="row m-1 g-3" onSubmit={(e) => e.preventDefault()}>
            <div className="col-md-3">
                <div className="form-floating mb-3">
                    <select
                        {...register("cajero",{
                            required:{
                                value:true,
                                message:'Debes de seleccionar al menos a un cajero.'
                            },
                            validate: value => {
                                return value !== "0" || 'Debes seleccionar un cajero.';
                            }
                        })}
                        className={`form-select ${!!errors?.cajero ? 'invalid-input':''}`}
                        id="cajero"
                        name="cajero"
                        aria-label="cajero"
                    >
                        <option value="">SELECCIONA UNA OPCIÓN</option>
                        {
                           usuariosCombo?.map((ele) => (
                                <option key={ele.Usu + '-' + ele.Nombre}
                                        value={ele.Usu}>
                                    {ele.Nombre}
                                </option>
                            ))
                        }
                    </select>
                    <label htmlFor="cajero">CAJEROS</label>
                    {
                        errors?.cajero && <div className="invalid-feedback-custom">{errors?.cajero.message}</div>
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
                        <option value="">SELECCIONA UNA OPCIÓN</option>
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
                        onChange={(e) => {
                            // Actualiza el valor del campo de entrada
                            e.preventDefault();
                            setValue("monto", e.target.value);
                            trigger("monto")
                        }}
                    />
                    <label htmlFor="monto">MONTO</label>
                    {
                        errors?.monto && <div className="invalid-feedback-custom">{errors?.monto.message}</div>
                    }
                </div>
            </div>
            <div className="col-md-2 mx-auto mb-2">
                <button type="button" className="btn btn-primary mt-2"
                        onClick={consultaDotaciones}
                        disabled={validaMonto()}>
                    <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                   GENERAR
                </button>
            </div>
        </form>
        {guarda && <ModalLoading options={optionsLoad}/>}
        <div className="row m-1 g-3">
            <div className="col-md-6 mx-auto">
                {
                    showDisponible.isAvailable &&
                    (<h5 className="text-blue text-center">
                        <i className="bi bi-cash me-2"></i>
                        <span>Cantidad Disponible </span>
                        <strong className="ms-2">{FormatoMoneda(parseFloat(showDisponible.cantidad))}</strong>
                    </h5>)
                }
            </div>
            {
                showDisponible.cantidad > 0.0 && (
                    <>
                        <div className="d-flex justify-content-center">
                            {
                                showDenominacion
                                    ? <Denominacion type="D" moneda={moneda} options={options}/>
                                    : <LoaderTable/>
                            }
                        </div>
                        <div className="col-md-12 d-flex justify-content-center">
                            <button type="button" className="btn btn-secondary me-3" onClick={nuevoEnvio}>
                                <i className="bi bi-plus"></i> NUEVA DOTACIÓN
                            </button>
                            <button type="button" className="btn btn-success"  onClick={terminarDotacion} disabled={finalizaOperacion || parseFloat(showDisponible.cantidad) === 0}>
                                <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                                DOTAR CAJA
                            </button>
                        </div>
                    </>
                )
            }
        </div>
        </>
    );
}