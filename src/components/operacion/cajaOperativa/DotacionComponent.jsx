import { useEffect, useState} from "react";
import {
    encryptRequest, formattedDate,
} from "../../../utils";
import {dataG} from "../../../App";
import {getDotaciones} from "../../../services/operacion-caja";
import {TableComponent} from "../../commons/tables";
import {LoaderTable} from "../../commons/LoaderTable";
import {useForm} from "react-hook-form";
import {consultaDotacionSucursal, consultaDotacionSucursalVal} from "../../../services/operacion-sucursal";

export const DotacionComponent = () => {

    const { register, handleSubmit, formState: {errors},
        watch,setValue } = useForm();
    const [currentDate, setCurrentDate] = useState('');
    const [data,setData] = useState({});
    const [showData,setShowData] = useState(false);
    const [formData,setFormData] = useState('');

    useEffect(() => {
        setCurrentDate(formattedDate);
        // Obtener la fecha actual en el formato YYYY-MM-DD
        setValue("fecha",formattedDate)
        // Realizar la consulta automáticamente al cargar la página
        onSubmitRecepcion({ fecha: currentDate});
    }, []);

    const refreshQuery = async () =>{
        const data_response = await getDotaciones(formData);
        data_response.headers = [...data_response.headers,'Acciones'];
        setData(data_response);
        setShowData(true);
    }

    const options = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Dotaciones',
        buscar: true,
        paginacion: true,
        disabledColumnsExcel:['Detalle','Acciones','Reporte'],
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Acciones",tool:"acciones-caja", refresh:refreshQuery},
            {columna:"Detalle",tool:"detalle",  params:{opcion:1}},
        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    const onSubmitRecepcion = handleSubmit(async (datos) => {
        datos.usuario = dataG.usuario;
        datos.sucursal = dataG.sucursal;

        const encryptedData = encryptRequest(datos);
        setFormData(encryptedData);

        const data_response = await getDotaciones(encryptedData);
        if(data_response.result_set){
            data_response.headers = [...data_response.headers,'Acciones'];
            setData(data_response);
        }else{
            setData([]);
        }
        setShowData(true);
    });

    return(
        <div className="container justify-content-center align-items-center mt-4">
            <div
                className="text-center mb-4"
            >
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <input
                            {...register("fecha",{
                                required:{
                                    value:true,
                                    message:'El campo Fecha Operación no puede ser vacio.'
                                },
                            })}
                            type="date"
                            className={`form-control ${!!errors?.fecha ? 'invalid-input':''}`}
                            id="fecha"
                            name="fecha"
                            placeholder="Ingresa la fecha de operación"
                            value={currentDate}
                            onChange={(e)=> setCurrentDate(e.target.value)}
                            autoComplete="off"
                        />
                        <label htmlFor="fecha">FECHA OPERACIÓN</label>
                        {
                            errors?.fecha && <div className="invalid-feedback-custom">{errors?.fecha.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-2 mx-auto">
                    <button
                        type="button"
                        className="m-2 btn btn-primary"
                        onClick={onSubmitRecepcion}
                    >
                        CONSULTAR
                        <i className="bi bi-search ms-2"></i>
                    </button>
                </div>
            </div>
            {showData
                ? <TableComponent data={data} options={options} />
                : <LoaderTable/>
            }
        </div>
    );
}