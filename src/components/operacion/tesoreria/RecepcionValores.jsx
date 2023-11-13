import {TableComponent} from "../../commons/tables";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {encryptRequest} from "../../../utils";
import {consultaEnvioSucursal} from "../../../services/operacion-tesoreria";

export const RecepcionValores = () => {

    const { register, handleSubmit, formState: {errors}, reset,watch } = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);
    const [formData,setFormData] = useState('');

    const refreshQuery = async () =>{
        const response = await consultaEnvioSucursal(formData);
        response.headers = [...response.headers,'Acciones']
        setData(response);
    }


    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Acciones",tool:"acciones-tesoreria",refresh:refreshQuery},
            {columna:"Detalle",tool:"detalle",  params:{opcion:1}},
        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    const onSubmitRecepcion = handleSubmit(async (data) => {
        const encryptedData = encryptRequest(data);
        setFormData(encryptedData);
        const response = await consultaEnvioSucursal(encryptedData);
        response.headers = [...response.headers,'Acciones']
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