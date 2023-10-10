import { useEffect, useState } from "react";
import { dataG } from "../../../../App";
import {encryptRequest, formattedDate} from "../../../../utils";
import { consultaCantidadDivisas, consultaMovimientos } from "../../../../services/operacion-caja";
import { ConsultaTotalesCaja } from "./ConsultaTotalesCaja";
import { TableComponent } from "../../../commons/tables";
import {TitleComponent} from "../../../commons";
import {useForm} from "react-hook-form";

export const ConsultaCaja = () => {
    const [datos, setDatos] = useState([]);
    const [datosMov, setDatosMov] = useState({});
    const [datosMovHist, setDatosMovHist] = useState({});
    const [isLoadingHist, setIsLoadingHist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const {register,reset,
        handleSubmit,formState:{errors}} = useForm();

    const options = {
        showMostrar: true,
        buscar: true,
        paginacion: true,
        tools: [
            {columna:"Estatus",tool:'estatus'},
            { columna: "Denominaciones", tool: 'ver-detalle-denominacion' },
            { columna: "Reimpresión ticket", tool: 'impresion-ticket' },
        ]
    }

    useEffect(() => {
        const getCantidadDivisas = async () => {
            const values = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
            }
            const encryptedData = encryptRequest(values);
            const result = await consultaCantidadDivisas(encryptedData);
            if(result.total_rows > 0){
                setDatos(result.result_set);
            }else{
                setDatos([]);
            }
        }

        getCantidadDivisas();

    }, []);

    useEffect(() => {
        /*Consulta movimientos del día e históricos*/
        const getConsultaMovimientos = async () => {
            const values = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
                fecha: formattedDate
            }
            const encryptedData = encryptRequest(values);
            const result = await consultaMovimientos(encryptedData);
            setDatosMov(result);
            setIsLoading(false);
        }
        getConsultaMovimientos();
    }, []);

    const handleConsultaMovimientosHistoricos = handleSubmit(async(data)=>{
        console.log(data);
        const values = {
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            fecha: data.fecha,
        }
        const encryptedData = encryptRequest(values);
        const result = await consultaMovimientos(encryptedData);
        setDatosMovHist(result);
        setIsLoadingHist(true);
        reset();
    });

    return (
        <>
            <div className="row justify-content-center">
                {
                    datos.map((element, index) => <ConsultaTotalesCaja key={index} data={element} />)
                }
            </div>
            <div className="row">
                {isLoading ? (
                    <p>Cargando...</p>
                ) : (
                    <>
                        <TitleComponent title="Movimientos del Día" icon="bi bi-calendar-date ms-3 me-2"/>
                        <TableComponent data={datosMov} options={options} />
                    </>
                )}
            </div>
            <div className="row">
                <TitleComponent title="Movimientos Históricos" icon="bi bi-calendar3 ms-3 me-2"/>
                <form className="row justify-content-center mb-3" onSubmit={handleConsultaMovimientosHistoricos} noValidate>
                    <div className="col-md-3">
                        <div className="form-floating">
                            <input
                                {...register("fecha", {
                                    required: {
                                        value: true,
                                        message: 'El campo Fecha no puede ser vacio.'
                                    },
                                })}
                                type="date"
                                className={`form-control ${!!errors?.fecha ? 'invalid-input' : ''}`}
                                id="fecha"
                                name="fecha"
                                placeholder="Ingresa la fecha de consulta"
                            />
                            <label htmlFor="fecha">FECHA CONSULTA</label>
                            {
                                errors?.fecha && <div
                                    className="invalid-feedback-custom">{errors?.fecha.message}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex">
                            <button
                                type="submit"
                                className="m-2 btn btn-primary d-grid gap-2"
                            >
                                  <span className="me-2">
                                      <strong>CONSULTAR</strong>
                                    <span
                                        className="bi bi-search ms-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                  </span>
                            </button>
                        </div>
                    </div>
                </form>
                {
                    isLoadingHist &&
                    <>
                        <TableComponent data={datosMovHist} options={options} />
                    </>
                }
            </div>
        </>
    );
}
