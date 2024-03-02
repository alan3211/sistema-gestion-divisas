import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {encryptRequest, formattedDate} from "../../../../utils";
import {TableComponent} from "../../../commons/tables";
import {dataG} from "../../../../App";
import {consultaDotacionSucursal, consultaDotacionSucursalVal} from "../../../../services/operacion-sucursal";
import {LoaderTable} from "../../../commons/LoaderTable";

export const EnvioOperaciones = ({opcion=1}) => {
    const { register, handleSubmit, formState: {errors},setValue } = useForm();
    const [showTable,setShowTable] = useState(false);
    const [data,setData] = useState(false);
    const [formData,setFormData] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setCurrentDate(formattedDate);
        // Obtener la fecha actual en el formato YYYY-MM-DD
        setValue("fecha_operacion",formattedDate)
        // Realizar la consulta automáticamente al cargar la página
        onSubmitRecepcion({ fecha_operacion: formattedDate});
    }, []);

    const refreshQuery = async () =>{
        if(opcion === 1){
            setData(await consultaDotacionSucursal(formData));
        }else{
            setData(await consultaDotacionSucursalVal(formData));
        }

    }

    const toolPerfil = opcion === 1 ? "cancelar-envio-sucursal":"acciones-envio-valores";

    const options = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Envio de Operaciones Sucursal',
        buscar: true,
        paginacion: true,
        disabledColumnsExcel:['Acciones','Detalle'],
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Acciones",tool:`${toolPerfil}`,refresh:refreshQuery},
            {columna:"Detalle",tool:"detalle",  params:{opcion:3}},
        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    const onSubmitRecepcion = handleSubmit(async (data) => {
        data.sucursal = dataG.sucursal;
        const encryptedData = encryptRequest(data);
        setFormData(encryptedData);
        //Opera_ConsultaDotacionesSucursal
        if(opcion === 1){
            setData(await consultaDotacionSucursal(encryptedData));
        }else{
            setData(await consultaDotacionSucursalVal(encryptedData));
        }
        setShowTable(true)
    });

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
                        onClick={onSubmitRecepcion}
                        className="m-2 btn btn-primary"
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