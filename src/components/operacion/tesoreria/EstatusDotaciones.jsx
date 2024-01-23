import {encryptRequest, formattedDate} from "../../../utils";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";
import {estatusOperaciones} from "../../../services/operacion-tesoreria";
import {TableComponent} from "../../commons/tables";
import {useEffect, useState} from "react";
import {LoaderTable} from "../../commons/LoaderTable";

export const EstatusDotaciones = () => {

    const catalogo = useCatalogo([20,17]);
    const { register, handleSubmit
        , formState: {errors}, setValue} = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);
    const [formData,setFormData] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [currentSucursal, setCurrentSucursal] = useState('1000');

    const refreshQuery = async () => {
        const response = await estatusOperaciones(formData);
        setData(response);
    }

    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
        excel:true,
        tableName:'Estatus Dotaciones',
        disabledColumnsExcel:['Cancelar','Detalle'],
        tools: [
            {columna:"Estatus",tool:'estatus'},
            {columna:"Detalle",tool:'detalle',params:{opcion:2}},
            {columna:"Cancelar",tool:'cancelar-tesoreria',refresh:refreshQuery}
        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    const onSubmitEstatus = handleSubmit(async (data) => {
        data.tipo_operacion = "Dotacion Sucursal";
        console.log("Data: ",data)
        const encryptedData = encryptRequest(data);
        setFormData(encryptedData);
        const response = await estatusOperaciones(encryptedData);
        setData(response);
        setShowTable(true)
    });

    useEffect(() => {
        // Obtener la fecha actual en el formato YYYY-MM-DD
        setValue("fecha_operacion",formattedDate);
        setValue("sucursal","1000");
        setCurrentDate(formattedDate);
        setCurrentSucursal(1000);

        let parametros = {
            fecha_operacion: formattedDate,
            tipo_operacion:"Dotacion Sucursal",
            sucursal:"1000",
        }
        // Realizar la consulta automáticamente al cargar la página
        onSubmitEstatus(parametros);
    }, []);

    return(
        <div className="container justify-content-center align-items-center mt-4">
            <div
                className="text-center mb-4"
            >
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("sucursal", {
                                validate: (value) => {
                                    return (
                                        value !== "0" || "Debes seleccionar una sucursal válida."
                                    );
                                },
                            })}
                            className={`form-select ${!!errors?.sucursal ? "invalid-input" : ""}`}
                            id="sucursal"
                            name="sucursal"
                            aria-label="Sucursal"
                            value={currentSucursal}
                            onChange={(e)=> setCurrentSucursal(e.target.value)}
                        >
                            <option value="0">SELECCIONA UNA OPCIÓN</option>
                            {catalogo[1]?.map((ele) => (
                                <option
                                    key={ele.id + "-" + ele.descripcion}
                                    value={ele.id}
                                >
                                    {ele.descripcion}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="sucursal">SUCURSAL</label>
                        {errors?.sucursal && (
                            <div className="invalid-feedback-custom">
                                {errors?.sucursal.message}
                            </div>
                        )}
                    </div>
                </div>
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
                        onClick={onSubmitEstatus}
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