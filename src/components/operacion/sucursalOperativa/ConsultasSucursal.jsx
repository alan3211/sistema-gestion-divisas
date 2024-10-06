
import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {consultaCantidadDivisasCaja, consultaCantidadDivisasSucursal} from "../../../services/operacion-sucursal";
import {ConsultaTotalesSuc} from "./ConsultaTotalesSuc";
import {encryptRequest, formattedDate} from "../../../utils";
import {ConsultaTotalesCajeros} from "./ConsultaTotalesCajeros";
import {TitleComponent} from "../../commons";
import {TableComponent} from "../../commons/tables";
import {useForm} from "react-hook-form";
import {consultaMovimientos} from "../../../services/operacion-caja";
import {getUsuariosSistema} from "../../../services";

export const ConsultasSucursal = () => {

    const [datos, setDatos] = useState([]);
    const [selectedCajero, setSelectedCajero] = useState("0");
    const [datosCaj, setDatosCaj] = useState([]);
    const [datosMov, setDatosMov] = useState({headers:[], result_set:[], total_rows:0});
    const [usuariosCombo, setUsuariosCombo] = useState([]);
    const {register,reset,
        handleSubmit,formState:{errors}} = useForm();


    const options = {
        showMostrar: true,
        buscar: true,
        paginacion: true,
        tools: [
            {columna:"Estatus",tool:'estatus'},
            { columna: "Denominaciones", tool: 'ver-detalle-denominacion' },
        ],
        filters:[{columna:'Monto Moneda',filter:'currency'},{columna:'Tipo Cambio',filter:'currency'},{columna:'Monto Entregado',filter:'currency'}],
        disabledColumns: ['Reimpresión ticket']
    }

    const obtieneUsuarios = async () => {

        const valores = {
            sucursal: dataG.sucursal,
            usuario: dataG.usuario
        }
        const encryptedData = encryptRequest(valores);

        const data_usuarios = await getUsuariosSistema(encryptedData);

        if (data_usuarios.hasOwnProperty("resultSize")) {
            setUsuariosCombo([]);
        } else {
            setUsuariosCombo(data_usuarios);
        }
    }

    useEffect(() => {
        obtieneUsuarios();
    }, []);

    useEffect(() => {
        const getCantidadDivisasSucursal = async () => {
            const values = {
                sucursal: dataG.sucursal,
            }
            const encryptedData = encryptRequest(values);
            const result = await consultaCantidadDivisasSucursal(encryptedData);
            if(result.total_rows > 0){
                setDatos(result.result_set);
            }else{
                setDatos([]);
            }
        }
        getCantidadDivisasSucursal();
    }, []);

    useEffect(() => {
        const getCantidadCajerosSucursal = async () => {
            const values = {
                sucursal: dataG.sucursal,
            }
            const encryptedData = encryptRequest(values);
            const result = await consultaCantidadDivisasCaja(encryptedData);
            if(result){
                setDatosCaj(result);
            }else{
                setDatosCaj([]);
            }
        }
        getCantidadCajerosSucursal();
    }, []);

    useEffect(() => {
        // Aquí realizas la consulta de movimientos cuando selectedCajero cambie
        const handleConsultaMovimientos = async (data) => {
            const values = {
                usuario: data.cajero,
                sucursal: dataG.sucursal,
                fecha: formattedDate(),
            };
            const encryptedData = encryptRequest(values);
            const result = await consultaMovimientos(encryptedData);
            setDatosMov(result);
            reset();
        };

        // Llama a la función de consulta de movimientos cuando selectedCajero cambie
        if (selectedCajero !== "0") {
            handleConsultaMovimientos({ cajero: selectedCajero });
        }
    }, [selectedCajero]);

    return (
        <>
            <div className="justify-content-center mt-3">
                 <div className="card">
                     <h5 className="card-title ms-3">
                         <strong> Resumen Sucursal {dataG.sucursal}</strong>
                     </h5>
                     <div className="d-flex row">
                         <div className="col-md-4">
                             <ConsultaTotalesSuc data={datos} />
                         </div>
                         <div className="col-md-8">
                             <ConsultaTotalesCajeros data={datosCaj}/>
                         </div>
                     </div>
                 </div>
            </div>
                <div className="justify-content-center mt-3">
                    <div className="card">
                        <TitleComponent title="Movimientos del Día" icon="bi bi-calendar-date ms-3 me-2"/>
                        <div className="row d-flex">
                            <div className="col-md-3 mx-auto">
                                <div className="form-floating mb-3">
                                    <select
                                        {...register("cajero", {
                                            required: {
                                                value: true,
                                                message: "Debes de seleccionar al menos a un cajero.",
                                            },
                                        })}
                                        className={`form-select ${!!errors?.cajero ? "invalid-input" : ""}`}
                                        id="cajero"
                                        name="cajero"
                                        aria-label="Cajero"
                                        onChange={(e) => setSelectedCajero(e.target.value)}
                                        disabled={usuariosCombo.length === 0}
                                    >
                                        <option value="">SELECCIONA UNA OPCIÓN</option>
                                        {usuariosCombo?.map((ele) => (
                                            <option
                                                key={ele.Usu + "-" + ele.Nombre}
                                                value={ele.Usu}
                                            >
                                                {ele.Nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="cajero">Cajeros</label>
                                    {errors?.cajero && (
                                        <div className="invalid-feedback-custom">
                                            {errors?.cajero.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-11 mx-auto">
                                { selectedCajero !== "0" && <TableComponent data={datosMov} options={options}/>}
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}