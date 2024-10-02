import {encryptRequest, formattedDate} from "../../../../utils";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {consultaComprasTablero} from "../../../../services/tools-services";

export const Compras = ({ data }) => {

    const [dataState, setDataState] = useState(data);
    const [fechaConsulta, setFechaConsulta] = useState(formattedDate());

    const {register,handleSubmit,setValue,formState:{errors}} = useForm();

    const onHandleDateChange = handleSubmit(async (formData) => {
        const encryptedData = encryptRequest(formData);
        const response = await consultaComprasTablero(encryptedData);
        console.log(response);
        if (response.result_set) {
            setDataState(response.result_set[0]);
        } else {
            setDataState({});
        }
    })

    if (Object.keys(dataState).length === 0 || parseInt(dataState['No Operaciones']) === 0) {
        return (
            <div className="mb-4">
                <div className="card revenue-card border-0">
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
                    <div className="card-body text-center p-2">
                        <h5 className="card-title fw-bolder">
                        <i className="bi bi-currency-dollar me-2"></i>
                        Compras <span>| {fechaConsulta}</span></h5>

                        <p className="text-blue small fw-bold">Total Compras {0}</p>
                        <div className="mt-2">
                            <div
                                className="text-warning d-flex align-items-center justify-content-center mx-auto">
                                <i className="ri ri-error-warning-fill fs-1"></i>
                            </div>
                            <p className="text-muted small mb-1">
                                Por el momento no hay compras al día consultado.
                            </p>
                        </div>
                        <hr className="my-3" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <div className="card revenue-card border-0">
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
                <div className="card-body text-center p-2">
                    <h5 className="card-title fw-bolder">Compras <span>| {fechaConsulta}</span></h5>
                    <p className="text-blue small fw-bold">Total Compras {dataState.Total}</p>
                    <div className="mt-2">
                        <div
                            className="rounded-circle card-icon d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-currency-dollar fs-2"></i>
                        </div>
                        <h6 className="mb-0 text-blue fw-bold">{dataState['No Operaciones']} {dataState['No Operaciones'] === 1 ? 'Operación' : 'Operaciones'}</h6>
                        <p className="text-success small fw-bold">{dataState.Porcentaje}% de {dataState['Nombre Sucursal']}</p>
                    </div>
                    <hr className="my-3" />
                    <div className="mb-3">
                        <div className="mt-2">
                            <p className="text-muted small mb-1">Sucursal con más compras</p>
                            <p className="mb-0">
                                <i className="ri ri-store-3-line fs-4 text-muted"></i>
                                <strong>{dataState['Nombre Sucursal']}</strong>
                            </p>
                            <p className="small fw-bolder"># {dataState.Sucursal}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
