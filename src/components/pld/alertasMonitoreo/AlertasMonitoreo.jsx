import {CardLayout, Layout} from "../../commons";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";
import {TableComponent} from "../../commons/tables";
import {encryptRequest} from "../../../utils";
import {consultaAlarmas} from "../../../services/pld-services";

export const AlertasMonitoreo = () => {

    const {register,handleSubmit,watch,formState:{errors}} =  useForm();
    const [meses, setMeses] = useState([]);
    const [anios, setAnios] = useState([]);
    const navigate = useNavigate();
    const catalogo = useCatalogo([29])

    const [isLoading,setIsLoading] = useState(false);
    const [isDetailShow,setIsDetailShow] = useState(false);
    const [dataAlerta, setDataAlerta] = useState([]);
    const [dataAlertaDetalle, setDataAlertaDetalle] = useState([]);


    useEffect(() => {
        // Obtenemos los nombres capitalizados de los meses
        const monthNames = Array.from({ length: 12 }, (_, index) => {
            const date = new Date(2000, index, 1); // Usamos el año 2000 como referencia
            const monthName = date.toLocaleString('default', { month: 'long' });
            return monthName.toUpperCase();
        });
        // Lógica para obtener la lista de años, por ejemplo, para los últimos 5 años
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

        setAnios(years);
        setMeses(monthNames);
    }, []);

    const moduleName= {
        title: 'PLD',
        module: "Alertas Monitoreo",
        icon: "ri ri-alarm-warning-line me-2"
    };

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);

    const optionsAlerta = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Alarma',
        buscar: true,
        paginacion: true,
        tools:[
            {columna:"Detalle",tool:"ver-detalle-alarma",deps:{setIsDetailShow,setDataAlertaDetalle}},
            {columna:"Analisis",tool:"analisis"},
            {columna:"Reporte",tool:"descarga-reporte"},
        ],
        filters:[{columna:"Monto Operado",filter:'currency'},],
        disabledColumnsExcel:['Detalle','Analisis','Reporte']
    }

    const optionsAlertaDetalle = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Detalle Alarma',
        buscar: true,
        paginacion: true,
        filters:[{columna:"Monto Opera",filter:'currency'},{columna:"Tipo Cambio",filter:'currency'}],
    }

    const consultaAlertas = handleSubmit(async (data) => {
        setIsLoading(true);
        const valores = {
            alarma: 1,
            numero_usuario: ''
        }
        const encryptedData = encryptRequest(valores);

        const datosAlarma = await consultaAlarmas(encryptedData);
        if (datosAlarma.hasOwnProperty("resultSize")) {
            setDataAlerta([]);
            setIsLoading(false);
        } else {
            setDataAlerta(datosAlarma);
            setIsLoading(false);
        }


    });

    return(
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.module} icon={moduleName.icon}>
                <div className="row mt-3">
                    <div className="col-md-5 mx-auto">
                        <div className="form-floating mb-3">
                            <select
                                {...register("tipo_alerta", {
                                    required: {
                                        value: true,
                                        message: 'Debes de seleccionar al menos un tipo de alerta.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un tipo de alerta válido.';
                                    }
                                })}
                                className={`form-select ${!!errors?.tipo_alerta ? 'invalid-input' : ''}`}
                                id="tipo_alerta"
                                name="tipo_alerta"
                                aria-label="Tipo Alerta"
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
                            <label htmlFor="tipo_reporte">TIPO DE ALERTA</label>
                            {
                                errors?.tipo_alerta &&
                                <div className="invalid-feedback-custom">{errors?.tipo_alerta   .message}</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <div className="col-md-3 form-floating mb-3 me-4">
                        <select
                            {...register("mes", {
                                required: {
                                    value: true,
                                    message: 'Debes de seleccionar un mes.'
                                }
                            })}
                            className={`form-select ${!!errors?.mes ? 'invalid-input' : ''}`}
                            id="mes"
                            name="mes"
                            aria-label="Mes"
                        >
                            <option value="0">SELECCIONA UN MES</option>
                            {meses.map((mes, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {mes}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="mes">MES</label>
                        {errors?.mes && <div className="invalid-feedback-custom">{errors?.mes.message}</div>}
                    </div>
                    <div className="col-md-3 form-floating mb-3 me-4">
                        <select
                            {...register("anio", {
                                required: {
                                    value: true,
                                    message: 'Debes de seleccionar un año.'
                                }
                            })}
                            className={`form-select ${!!errors?.anio ? 'invalid-input' : ''}`}
                            id="anio"
                            name="anio"
                            aria-label="Año"
                        >
                            <option value="0">SELECCIONA UN AÑO</option>
                            {anios.map((anio) => (
                                <option key={anio} value={anio}>
                                    {anio}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="anio">AÑO</label>
                        {errors?.anio && <div className="invalid-feedback-custom">{errors?.anio.message}</div>}
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="col-md-12 mx-auto text-center">
                        <button type="button" className="btn btn-primary mt-2 ms-2 me-2"
                            onClick={consultaAlertas}
                        >
                            <span className="bi bi-search me-2" aria-hidden="true"></span>
                            CONSULTAR
                        </button>
                    </div>
                </div>

                {
                    !isLoading && <TableComponent data={dataAlerta} options={optionsAlerta}/>
                }

                {
                    isDetailShow &&(
                    <div className="row">
                        <h5 className="text-blue text-center">
                            <i className="bi bi-folder-symlink-fill me-2"></i>
                            <span>Detalle</span>
                        </h5>
                        <TableComponent data={dataAlertaDetalle} options={optionsAlertaDetalle}/>
                    </div>)

                }


            </CardLayout>
        </Layout>
    );
}