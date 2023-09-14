import {encryptRequest, validaFechas} from "../../../utils";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook/useCatalogo";
import {consultaEnvioSucursal, estatusOperaciones} from "../../../services/operacion-tesoreria";
import {TableComponent} from "../../commons/tables";
import {useState} from "react";

export const EstatusDotaciones = () => {

    const catalogo = useCatalogo([20,17]);
    const { register, handleSubmit, formState: {errors}, reset,watch } = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);
    const [formData,setFormData] = useState('');

    const refreshQuery = async () => {
        const response = await estatusOperaciones(formData);
        setData(response);
    }

    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
        tools: [
            {columna:"Estatus",tool:'estatus'},
            {columna:"Detalle",tool:'detalle',params:{opcion:2}},
            {columna:"Cancelar",tool:'cancelar-tesoreria',refresh:refreshQuery}
        ]
    }

    const onSubmitEstatus = handleSubmit(async (data) => {
        const encryptedData = encryptRequest(data);
        setFormData(encryptedData);
        const response = await estatusOperaciones(encryptedData);
        setData(response);
        setShowTable(true)
    });

    return(
        <div className="container justify-content-center align-items-center mt-4">
            <form
                className="text-center mb-4"
                onSubmit={onSubmitEstatus}
                noValidate
            >
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("tipo_operacion", {
                                required: {
                                    value: true,
                                    message: "Debes de seleccionar al menos un tipo de operación.",
                                },
                                validate: (value) => {
                                    return (
                                        value !== "0" || "Debes seleccionar un tipo de operación válido."
                                    );
                                },
                            })}
                            className={`form-select ${!!errors?.tipo_operacion ? "invalid-input" : ""}`}
                            id="tipo_operacion"
                            name="tipo_operacion"
                            aria-label="tipo_operacion"
                        >
                            <option value="0">Selecciona una opción</option>
                            {catalogo[0]?.map((ele) => (
                                <option
                                    key={ele.id + "-" + ele.descripcion}
                                    value={ele.id}
                                >
                                    {ele.descripcion}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="tipo_operacion">Tipo de Operación</label>
                        {errors?.tipo_operacion && (
                            <div className="invalid-feedback-custom">
                                {errors?.tipo_operacion.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("sucursal", {
                                required: {
                                    value: true,
                                    message: "Debes de seleccionar al menos una sucursal.",
                                },
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
                        >
                            <option value="0">Selecciona una opción</option>
                            {catalogo[1]?.map((ele) => (
                                <option
                                    key={ele.id + "-" + ele.descripcion}
                                    value={ele.id}
                                >
                                    {ele.descripcion}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="sucursal">Sucursal</label>
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