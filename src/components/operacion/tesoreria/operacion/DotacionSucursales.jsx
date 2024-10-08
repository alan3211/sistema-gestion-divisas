import { useForm } from "react-hook-form";
import { useCatalogo } from "../../../../hook";
import {encryptRequest, formattedDateWS, globalData, opciones, OPTIONS, validarMoneda} from "../../../../utils";
import {dotaSucursales} from "../../../../services/operacion-tesoreria";
import {dataG} from "../../../../App";
import {toast} from "react-toastify";

export const DotacionSucursales = ({actualizarSaldo}) => {
    const { register, handleSubmit, formState: {errors}, reset } = useForm();
    const catalogo = useCatalogo([17, 15]);

    const onSubmitDotacionSucursales = handleSubmit(async (data) => {
        data.usuario = dataG.usuario || globalData.usuario;
        data.operacion = "Dotación Sucursal";
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");
        data.ticket = `DOTSUC${dataG.sucursal}${dataG.usuario}${formattedDateWS()}${horaOperacion}`
        const encryptedData = encryptRequest(data);
        const response = await dotaSucursales(encryptedData);
        if(response.mensaje.includes("exitosamente")){
            toast.success(response.mensaje, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored",
                onClose:actualizarSaldo,
            });
            reset();
        }else{
            toast.error(response.mensaje, OPTIONS);
        }
    });

    return (
        <>
            <div
                className="text-center"
            >
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
                            <option value="">SELECCIONA UNA OPCIÓN</option>
                            {catalogo[0]?.map((ele) => (
                                <option
                                    key={ele.id + "-" + ele.descripcion}
                                    value={ele.id}
                                >
                                    {ele.descripcion}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="sucursal">SUCURSAL</label>
                        {errors?.sucursal && (
                            <div className="invalid-feedback-custom">
                                {errors?.sucursal.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("moneda", {
                                required: {
                                    value: true,
                                    message: "Debes de seleccionar al menos una moneda.",
                                },
                                validate: (value) => {
                                    return (
                                        value !== "0" || "Debes seleccionar una moneda válida."
                                    );
                                },
                            })}
                            className={`form-select ${
                                !!errors?.moneda ? "invalid-input" : ""
                            }`}
                            id="moneda"
                            name="moneda"
                            aria-label="Moneda"
                        >
                            <option value="">SELECCIONA UNA OPCIÓN</option>
                            {catalogo[1]?.map((ele) => (
                                <option
                                    key={ele.id + "-" + ele.descripcion}
                                    value={ele.id}
                                >
                                    {ele.descripcion}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="moneda">MONEDA</label>
                        {errors?.moneda && (
                            <div className="invalid-feedback-custom">
                                {errors?.moneda.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <input
                            {...register("monto", {
                                required: {
                                    value: true,
                                    message: "El campo Monto no puede estar vacío.",
                                },
                                validate: {
                                    moneda: (value) =>
                                        validarMoneda("Monto", value),
                                    mayorACero: (value) =>
                                        parseFloat(value) > 0 ||
                                        "El Monto debe ser mayor a 0",
                                },
                            })}
                            type="text"
                            className={`form-control ${
                                !!errors?.monto ? "is-invalid" : ""
                            }`}
                            id="monto"
                            name="monto"
                            placeholder="Ingresa el monto"
                            autoComplete="off"
                        />
                        <label htmlFor="monto" className="form-label">
                            MONTO
                        </label>
                        {errors?.monto && (
                            <div className="invalid-feedback">{errors?.monto.message}</div>
                        )}
                    </div>
                </div>
                <div className="col-md-4 mx-auto">
                    <div className="form-floating mb-3">
                        <input
                            {...register("monto_equivalente", {
                                required: {
                                    value: true,
                                    message: "El campo Equivalente en MXP no puede estar vacío.",
                                },
                                validate: {
                                    moneda: (value) =>
                                        validarMoneda("Equivalente en MXP", value),
                                    mayorACero: (value) =>
                                        parseFloat(value) > 0 ||
                                        "El Equivalente en MXP debe ser mayor a 0",
                                },
                            })}
                            type="text"
                            className={`form-control ${
                                !!errors?.monto_equivalente ? "is-invalid" : ""
                            }`}
                            id="monto_equivalente"
                            name="monto_equivalente"
                            placeholder="Ingresa el equivalente en pesos"
                            autoComplete="off"
                        />
                        <label htmlFor="monto_equivalente" className="form-label">
                            EQUIVALENTE EN MXP
                        </label>
                        {errors?.monto_equivalente && (
                            <div className="invalid-feedback">
                                {errors?.monto_equivalente.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-md-2 mx-auto">
                    <button
                        type="button"
                        className="m-2 btn btn-primary"
                        onClick={onSubmitDotacionSucursales}
                    >
                      <i className="bi bi-save me-2"></i>
                      GUARDAR
                    </button>
                </div>
            </div>
        </>
    );
};
