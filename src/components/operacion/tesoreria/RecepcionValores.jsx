import {TableComponent} from "../../commons/tables";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {encryptRequest, formattedDate} from "../../../utils";
import {consultaEnvioSucursal} from "../../../services/operacion-tesoreria";
import {LoaderTable} from "../../commons/LoaderTable";

export const RecepcionValores = () => {

    const { register, handleSubmit,
        formState: {errors}, setValue,watch } = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);
    const [formData,setFormData] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    const refreshQuery = async () =>{
        const response = await consultaEnvioSucursal(formData);
        response.headers = [...response.headers,'Acciones']
        setData(response);
    }


    const options = {
        showMostrar:true,
        excel:true,
        tableName:'Recepción de Valores desde Sucursal',
        buscar: true,
        paginacion: true,
        disabledColumnsExcel:['Acciones','Detalle'],
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Acciones",tool:"acciones-recepcion-valores",refresh:refreshQuery},
            {columna:"Detalle",tool:"detalle",  params:{opcion:1}},
        ],
        filters:
            [{columna:'Comentario',filter:'tooltip'},
            {columna:'Monto',filter:'currency'}],
    }

    const onSubmitRecepcion = handleSubmit(async (data) => {
        const encryptedData = encryptRequest(data);
        setFormData(encryptedData);
        const response = await consultaEnvioSucursal(encryptedData);
        response.headers = [...response.headers,'Acciones']
        setData(response);
        setShowTable(true)
    });

    useEffect(() => {
        // Obtener la fecha actual en el formato YYYY-MM-DD
        setValue("fecha_operacion",formattedDate());
        setCurrentDate(formattedDate());

        let parametros = {
            fecha_operacion: formattedDate(),
        }
        // Realizar la consulta automáticamente al cargar la página
        onSubmitRecepcion(parametros);
    }, []);


    return (
        <div className="container justify-content-center align-items-center mt-4">
            <div
                className="text-center mb-4"
            >
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <input
                            {...register("fecha_operacion",{
                                required:{
                                    value:true,
                                    message:'El campo Fecha Operación no puede ser vacio.'
                                },
                            })}
                            type="date"
                            className={`form-control ${!!errors?.fecha_operacion ? 'invalid-input':''}`}
                            id="fecha_operacion"
                            name="fecha_operacion"
                            placeholder="Ingresa la fecha de operación"
                            value={currentDate}
                            onChange={(e)=> setCurrentDate(e.target.value)}
                            autoComplete="off"
                        />
                        <label htmlFor="fecha_operacion">FECHA OPERACIÓN</label>
                        {
                            errors?.fecha_operacion && <div className="invalid-feedback-custom">{errors?.fecha_operacion.message}</div>
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
            {
                showTable
                    ? <TableComponent data={data} options={options}/>
                    : <LoaderTable/>
            }
        </div>
    );
}