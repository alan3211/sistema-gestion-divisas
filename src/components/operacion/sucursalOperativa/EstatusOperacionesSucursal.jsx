import {useForm} from "react-hook-form";
import {useState} from "react";
import {encryptRequest} from "../../../utils";
import {estatusOperaciones} from "../../../services/operacion-tesoreria";
import {TableComponent} from "../../commons/tables";

export const EstatusOperacionesSucursal = () => {
    const { register, handleSubmit, formState: {errors}, reset,watch } = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);

    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
    }

    const onSubmitRecepcion = handleSubmit(async (data) => {
        const encryptedData = encryptRequest(data);
        const response = await estatusOperaciones(encryptedData);
        console.log(response)
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
                        <label htmlFor="fecha_operacion">Fecha Operación</label>
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
                        Consultar
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