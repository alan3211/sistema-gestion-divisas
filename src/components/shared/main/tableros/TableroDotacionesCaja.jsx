import {encryptRequest, formattedDate} from "../../../../utils";
import {TableComponent} from "../../../commons/tables";
import {useEffect, useState} from "react";
import {consultaMovimientosDotacionesACaja} from "../../../../services/tools-services";
import {useForm} from "react-hook-form";

export const TableroDotacionesCaja = ({data}) => {

    const [dataState, setDataState] = useState(data);
    const [fechaConsulta, setFechaConsulta] = useState(formattedDate());

    const options = {
        showMostrar:true,
        excel:true,
        buscar:true,
        tableName:'Dotaciones a Caja por surcursal',
        paginacion: true,
        tools:[
            {columna:"Estatus",tool:"estatus"},
        ],
        filters:[
            {columna:"Monto Dotaciones Aceptadas",filter:'currency'},
            {columna:"Monto Dotaciones Pendientes",filter:'currency'},
        ],
    }

    const {register,handleSubmit,setValue,formState:{errors}} = useForm();

    useEffect(() => {
        // Este efecto se ejecutará cada vez que cambie la fechaConsulta
        console.log("Fecha actualizada:", fechaConsulta);
    }, [fechaConsulta]);

    const onHandleDateChange = handleSubmit(async (formData) => {
        const encryptedData = encryptRequest(formData);
        const response = await consultaMovimientosDotacionesACaja(encryptedData);
        if (response.result_set) {
            setDataState(response);
        } else {
            setDataState({});
        }
    });

    return (
        <div className="col-12">
            <div className="card recent-sales overflow-auto" style={{maxHeight:"700px"}}>
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
                                <form className={`col-12`} onSubmit={(e) => e.preventDefault()}>
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
                        <i className="bi bi-currency-dollar me-2"></i>
                        Dotaciones a Caja <span>|  { fechaConsulta }</span>
                    </h5>
                    <TableComponent data={dataState} options={options} />
                </div>

            </div>
        </div>
    );
}