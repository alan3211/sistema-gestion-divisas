import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";
import {useContext, useEffect, useState} from "react";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {
    eliminarDenominacionesConCantidadCero, encryptRequest, FormatoMoneda,
    formattedDateWS,
    getDenominacion,
    obtenerObjetoDenominaciones,
    opciones, validarMoneda
} from "../../../utils";
import {dataG} from "../../../App";
import {getCantidadDisponible, realizarOperacionSucursalDotacion} from "../../../services/operacion-sucursal";
import {toast} from "react-toastify";
import {Denominacion} from "../denominacion";
import {getUsuariosSistema} from "../../../services";

export const DotacionCajaSucursal = () => {
    const [usuariosCombo,setUsuariosCombo] = useState([]);
    const {register,handleSubmit
        ,formState:{errors},reset
        ,watch} = useForm()
    const catalogo = useCatalogo([15]);
    const [showDenominacion,setShowDenominacion] =  useState(false);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });
    const [showDisponible,setShowDisponible] = useState({
        isAvailable:false,
        title: ''
    })

    const [finalizaOperacion,setFinalizaOperacion] = useState(true);

    const {denominacionD} = useContext(DenominacionContext);

    const options = {
        title: '',
        importe: parseInt(watch('monto')),
        habilita,
        setHabilita,
        setFinalizaOperacion
    }

    const terminarDotacion = handleSubmit(async(data)=>{
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

        console.log(resultado);
        if(resultado){
            toast.success(`Se ha enviado los valores correctamente de ${data.moneda}`,{
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
            reset();
            setShowDenominacion(false);
            denominacionD.reset();
        }
    });

    const nuevoEnvio = () => {
        setShowDenominacion(false);
        reset();
        denominacionD.reset();
    }

    const obtieneUsuarios = async () =>{
        const valores = {
            sucursal:dataG.sucursal,
            usuario: dataG.usuario,
        }
        const encryptedData = encryptRequest(valores)
        const data_usuarios = await getUsuariosSistema(encryptedData);
        setUsuariosCombo(data_usuarios);
    }

    const obtieneDisponibilidad = async () =>{
        const valores = {
            sucursal:dataG.sucursal,
            divisa: watch("moneda")
        }
        const encryptedData = encryptRequest(valores)
        const disponibilidad = await getCantidadDisponible(encryptedData);
        console.log(disponibilidad);
        setShowDisponible({
            isAvailable: true,
            cantidad: disponibilidad.result_set[0].Disponible
        });
        console.log(showDisponible);
    }

    useEffect(()=>{
        obtieneUsuarios();
    },[]);

    useEffect(() => {
        if(watch("moneda") === '0'){
            setShowDenominacion(false);
            setShowDisponible({
                isAvailable: false,
                cantidad: '0'
            });
        }else{
            setShowDenominacion(true);
            obtieneDisponibilidad();
        }
    }, [watch("moneda")]);

    return (
        <form className="row m-1 g-3 justify-content-center" onSubmit={terminarDotacion} noValidate>
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
                        <option value="0">SELECCIONA UNA OPCIÓN</option>
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
            <div className="d-flex justify-content-center">
                {
                    showDenominacion && <Denominacion type="D" moneda={watch('moneda')} options={options}/>
                }
            </div>
            <div className="col-md-12 d-flex justify-content-center">
                <button className="btn btn-secondary me-3" onClick={nuevoEnvio}>
                    <i className="bi bi-plus"></i> NUEVA DOTACIÓN
                </button>
                <button type="submit" className="btn btn-primary" disabled={finalizaOperacion}>
                    <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                    FINALIZAR OPERACIÓN
                </button>
            </div>
        </form>
    );
}