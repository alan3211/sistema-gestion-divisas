import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {encryptRequest, formattedDate} from "../../../../utils";
import {TableComponent} from "../../../commons/tables";
import {dataG} from "../../../../App";
import {consultaDotacionSucursal} from "../../../../services/operacion-sucursal";

export const EnvioOperaciones = () => {
    const { register, handleSubmit, formState: {errors},
        reset,setValue } = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);
    const [formData,setFormData] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Obtener la fecha actual en el formato YYYY-MM-DD
        setValue("fecha_operacion",formattedDate)
        // Realizar la consulta automáticamente al cargar la página
        onSubmitRecepcion({ fecha: formattedDate });
    }, []);

    const refreshQuery = async () =>{
        const response = await consultaDotacionSucursal(formData);
        setData(response);
    }

    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Cancelar",tool:"cancelar-envio-sucursal",refresh:refreshQuery},
            {columna:"Detalle",tool:"detalle",  params:{opcion:3}},
        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    const onSubmitRecepcion = handleSubmit(async (data) => {
        data.sucursal = dataG.sucursal;
        const encryptedData = encryptRequest(data);
        setFormData(encryptedData);
        const response = await consultaDotacionSucursal(encryptedData);
        setData(response);
        setShowTable(true)
    });


    return (
        <div className="container justify-content-center align-items-center mt-4">
            <form
                className="text-center mb-4"
                onSubmit={onSubmitRecepcion}
                noValidate
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
                        />
                        <label htmlFor="fecha_operacion">FECHA OPERACIÓN</label>
                        {
                            errors?.fecha_operacion && <div className="invalid-feedback-custom">{errors?.fecha_operacion.message}</div>
                        }
                    </div>
                </div>
                <div className="col-md-2 mx-auto">
                    <button
                        type="submit"
                        className="m-2 btn btn-primary"
                    >
                        CONSULTAR
                        <i className="bi bi-search ms-2"></i>
                    </button>
                </div>
            </form>
            {
                showTable && <TableComponent data={data} options={options}/>
            }
        </div>
    );
}