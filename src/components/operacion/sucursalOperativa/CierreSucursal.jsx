import {encryptRequest, formattedDate, validaFechas} from "../../../utils";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";
import {consultaEnvioSucursal, estatusOperaciones} from "../../../services/operacion-tesoreria";
import {TableComponent} from "../../commons/tables";
import {useEffect, useState} from "react";

export const CierreSucursal = () => {

    const { register, handleSubmit
        , formState: {errors}, setValue} = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);
    const [formData,setFormData] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const refreshQuery = async () => {
        const response = await estatusOperaciones(formData);
        setData(response);
    }

    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
        excel:true,
        tools: [
            {columna:"Estatus",tool:'estatus'},
            {columna:"Detalle",tool:'detalle',params:{opcion:2}},
            {columna:"Cancelar",tool:'cancelar-tesoreria',refresh:refreshQuery}
        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    const onSubmitCierraOperacion = handleSubmit(async (data) => {
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
        setCurrentDate(formattedDate);
    }, []);

    return(
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
                <div className="col-md-3 mx-auto">
                    <button
                        type="button"
                        className="m-2 btn btn-danger"
                        onClick={onSubmitCierraOperacion}
                    >
                        <i className="bi bi-x-circle me-2"></i>
                        CERRAR OPERACIÓN
                    </button>
                </div>
            </div>
            {
                showTable && <TableComponent data={data} options={options}/>
            }
        </div>
    );
}