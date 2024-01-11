import {encryptRequest, formattedDate, mensajeSinElementos} from "../../../../utils";
import { MessageComponent } from "../../../commons";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {consultaActividadReciente} from "../../../../services/tools-services";

export const TableroActividad = ({ data, showDataActividad }) => {
    const maxElementsToShow = 3; // Número máximo de elementos antes de mostrar el scroll
    const [dataState, setDataState] = useState(data);
    const [showDataAct, setShowDataAct] = useState(showDataActividad);
    const [fechaConsulta, setFechaConsulta] = useState(formattedDate);

    const {register,handleSubmit,watch ,setValue,formState:{errors}} = useForm();

    useEffect(() => {
        // Este efecto se ejecutará cada vez que cambie la fechaConsulta
        console.log("Fecha actualizada en useEffect:", fechaConsulta);
    }, [fechaConsulta]);

    const onHandleDateChange = handleSubmit(async (formData) => {
        console.log("FECHA CONSULTA: ");
        console.log(formData.fecha);
        const encryptedData = encryptRequest(formData);
        const response = await consultaActividadReciente(encryptedData);
        if (response.result_set) {
            setShowDataAct(true);
            setDataState(response.result_set);
        } else {
            setShowDataAct(false);
            setDataState([]);
        }
    });

    return (
        <div className="card">
            <div className="filter">
                <a className="icon" data-bs-toggle="dropdown" aria-expanded="true" style={{ padding: "20px",cursor:"pointer" }}>
                    <i className="bi bi-three-dots"></i>
                </a>
                <ul
                    className="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                    style={{ position: "absolute", inset: "0px 0px auto auto", margin: "0px", transform: "translate3d(0px, 29.5px, 0px)" }}
                >
                    <li className="dropdown-header text-start">
                        <h6>Filtro</h6>
                    </li>
                    <li>
                        <a className="dropdown-item">
                            <form className={`col-12`}>
                                <div className="form-floating">
                                    <input
                                        {...register("fecha", {})}
                                        type="date"
                                        className={`form-control ${!!errors?.fecha ? 'invalid-input' : ''}`}
                                        id="fecha"
                                        name="fecha"
                                        placeholder="Ingresa la fecha de consulta"
                                        onChange={(e) => {
                                            setValue("fecha", e.target.value);
                                            setFechaConsulta(e.target.value)
                                            onHandleDateChange(e.target.value)
                                        }}
                                        autoComplete="off"
                                    />
                                    <label htmlFor="fecha">FECHA CONSULTA</label>
                                    {errors?.fecha && (
                                        <div className="invalid-feedback-custom">{errors?.fecha.message}</div>
                                    )}
                                </div>
                            </form>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="card-body">
                <h5 className="card-title">
                    <i className="ri ri-time-line me-2"></i>Actividad Reciente <span>| {fechaConsulta}</span></h5>
                <div className="activity custom-scrollbar" style={{ overflowY: dataState.length > maxElementsToShow ? 'auto' : 'visible', maxHeight: '300px' }}>
                    {showDataAct ? (
                        <>
                            {dataState.map((elemento, index) => {
                                return (
                                    <div key={index} className="activity-item d-flex">
                                        <div className="activite-label">{elemento.Hora}</div>
                                        <i className={`bi bi-circle-fill activity-badge text-success align-self-start`}></i>
                                        <div className="activity-content">{elemento.Descripcion}</div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <MessageComponent estilos={mensajeSinElementos}>No hay actividad reciente.</MessageComponent>
                    )}
                </div>
            </div>
        </div>
    );
};
