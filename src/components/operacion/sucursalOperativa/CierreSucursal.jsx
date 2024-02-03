import {encryptRequest, formattedDate, OPTIONS} from "../../../utils";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {cierreSucursalServ} from "../../../services/operacion-sucursal";
import {ModalTicket} from "../../commons/modals/ModalTicket";
import {toast} from "react-toastify";
import {ModalLoading} from "../../commons/modals/ModalLoading";

export const CierreSucursal = () => {

    const [guarda, setGuarda] = useState(false);

    const { register, handleSubmit
        , formState: {errors}, setValue} = useForm();
    const [showModal,setShowModal] = useState(false);
    const [currentDate, setCurrentDate] = useState('');

    const onSubmitCierraOperacion = handleSubmit(async (data) => {
        setGuarda(true);
        data.sucursal = dataG.sucursal;
        data.usuario = dataG.usuario;
        const encryptedData = encryptRequest(data);
        const mensaje = await cierreSucursalServ(encryptedData);
        if(mensaje.startsWith('No')){
            toast.warn(mensaje,OPTIONS);
        }else {
            toast.success(mensaje,OPTIONS);
        }
        setGuarda(false);
        setShowModal(false);
    });

    useEffect(() => {
        // Obtener la fecha actual en el formato YYYY-MM-DD
        setValue("fecha_operacion",formattedDate);
        setCurrentDate(formattedDate);
    }, []);

    const optionsLoad = {
        showModal: guarda,
        title: `Realizando cierre de sucursal ...`,
    };


    return(
        <form className="container justify-content-center align-items-center mt-4">
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
                        onClick={()=> setShowModal(true)}
                    >
                        <i className="bi bi-x-circle me-2"></i>
                        CERRAR OPERACIÓN
                    </button>
                </div>
            </div>
            {
                guarda && <ModalLoading options={optionsLoad} />
            }
            {
                showModal && (
                    <ModalTicket title="¿Está seguro de confirmar el cierre de las operaciones correspondientes al día de hoy?"
                                 showModal={showModal}
                                 closeModalAndReturn={()=>{
                                     setShowModal(false)
                                 }}
                                 hacerOperacion={onSubmitCierraOperacion}
                                 icon="bi bi-exclamation-triangle-fill text-warning m-2"/>
                )
            }
        </form>
    );
}