import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {encryptRequest} from "../../../utils";
import {TableComponent} from "../../commons/tables";
import {consultaDotacionBoveda} from "../../../services/operacion-logistica";

export const ConsultaBovedas = ({perfil}) => {

    const { register, handleSubmit, formState: {errors},
        reset,setValue } = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);
    const [formData,setFormData] = useState('');

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Obtener la fecha actual en el formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);
        setValue("fecha",today)
        // Realizar la consulta automáticamente al cargar la página
        onSubmitRecepcion({ fecha: today });
    }, []);

    const refreshQuery = async () =>{
        const response = await consultaDotacionBoveda(formData);
        setData(response);
    }

    const toolPerfil = perfil === "L" ? "cancelar-envio-boveda":"acciones-boveda";
    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Acciones",tool:`${toolPerfil}`,refresh:refreshQuery},
        ],
        filters:[{columna:'Monto Solicitado',filter:'currency'}]
    }
    const onSubmitRecepcion = handleSubmit(async (data) => {
        const encryptedData = encryptRequest(data);
        setFormData(encryptedData);
        const response = await consultaDotacionBoveda(encryptedData);
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
                            {...register("fecha",{
                                required:{
                                    value:true,
                                    message:'El campo Fecha no puede ser vacio.'
                                },
                            })}
                            type="date"
                            className={`form-control ${!!errors?.fecha ? 'invalid-input':''}`}
                            id="fecha"
                            name="fecha"
                            placeholder="Ingresa la fecha de consulta"
                            value={currentDate}
                        />
                        <label htmlFor="fecha">FECHA</label>
                        {
                            errors?.fecha && <div className="invalid-feedback-custom">{errors?.fecha.message}</div>
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
            showTable && (
                 <TableComponent data={data} options={options}/>
                )
            }
        </div>
    );
}