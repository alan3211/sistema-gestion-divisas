import {useCatalogo} from "../../../hook";
import {useForm} from "react-hook-form";
import {encryptRequest, FormatoMoneda} from "../../../utils";
import {useEffect, useState} from "react";
import {consultaAsignacionBoveda, consultaCantidadBoveda} from "../../../services/operacion-logistica";
import {AsignaFondosSucursal} from "./AsignaFondosSucursal";

export const FondosSucursal = () => {

    const catalogo = useCatalogo([24,15]);
    const {register,formState:{errors},handleSubmit,reset,watch } = useForm();
    const [data,setData] = useState([]);
    const [showData,setShowData] = useState(false);
    const [moneda,setMoneda] = useState('');
    const [showCantidad,setShowCantidad] =  useState(false);
    const [cantidadDisponible,setCantidadDisponible] = useState(0);
    const [encryptedData,setEncryptedData] = useState('');

    const handleForm = handleSubmit(async(data)=>{
        setMoneda(data.moneda);
        const encryptedDatos = encryptRequest(data);
        const response = await consultaAsignacionBoveda(encryptedDatos);
        const cantidadBoveda = await consultaCantidadBoveda(encryptedDatos);


        if(response.total_rows > 0){
            setShowData(true);
            setData(response);
            setCantidadDisponible(cantidadBoveda)
            setShowCantidad(true)
        }else{
            setData([]);
            setShowData(false);
            setShowCantidad(false)
        }
        setEncryptedData(encryptedDatos);
    });

    const refreshData = async() => {
        const cantidadBoveda = await consultaCantidadBoveda(encryptedData);
        setCantidadDisponible(cantidadBoveda)
        setShowCantidad(false)
        setShowData(false);
        reset();
    }

    useEffect(() => {
        setShowData(false);
        setShowCantidad(false)
    }, [watch("moneda")]);


    return(
        <>
            <div className="g-3 mt-3">
                <div className="row justify-content-center">
                    <div className="col-md-3">
                        <div className="form-floating mb-3">
                            <select
                                {...register("boveda",{
                                    required:{
                                        value:true,
                                        message:'Debes de seleccionar al menos una bóveda.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar una bóveda válida.';
                                    }
                                })}
                                className={`form-select ${!!errors?.estado ? 'invalid-input':''}`}
                                id="boveda"
                                name="boveda"
                                aria-label="Boveda"
                            >
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[0]?.map((ele) => (
                                        <option key={ele.id + '-' + ele.descripcion}
                                                value={ele.id}>
                                            {ele.descripcion.toUpperCase()}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="boveda">Bóveda</label>
                            {
                                errors?.boveda && <div className="invalid-feedback-custom">{errors?.boveda.message}</div>
                            }
                        </div>
                    </div>
                        <div className="col-md-3">
                            <div className="form-floating mb-3">
                                <select
                                    {...register("moneda",{
                                        required:{
                                            value:true,
                                            message:'Debes de seleccionar al menos una moneda.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una moneda válida.';
                                        }
                                    })}
                                    className={`form-select ${!!errors?.moneda ? 'invalid-input':''}`}
                                    id="moneda"
                                    name="moneda"
                                    aria-label="Moneda"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[1]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion.toUpperCase()}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="moneda">Moneda</label>
                                {
                                    errors?.moneda && <div className="invalid-feedback-custom">{errors?.moneda.message}</div>
                                }
                            </div>
                        </div>

                        <div className="col-md-3">
                            <button
                                type="button"
                                onClick={handleForm}
                                className="btn btn-primary mt-2">
                                CONSULTAR
                                <span
                                    className="bi bi-search ms-2"
                                    role="status"
                                    aria-hidden="true">
                                </span>
                            </button>
                        </div>
                </div>
            </div>
            {showCantidad && (<h5 className="text-blue text-center">
                <i className="bi bi-bank me-2"></i>
                <span>Disponible en Boveda:</span>
                <strong className="ms-2">{FormatoMoneda(parseFloat(cantidadDisponible))}</strong>
            </h5>)}
            {
                showData && <AsignaFondosSucursal data={data} moneda={moneda} cantidadDisponible={cantidadDisponible} refreshData={refreshData} />
            }
        </>
    );
}