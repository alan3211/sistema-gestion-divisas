import {encryptRequest, formattedDateWS, globalData, opciones, OPTIONS, validarMoneda} from "../../../../utils";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../../hook";
import {dataG} from "../../../../App";
import {dotaSucursales} from "../../../../services/operacion-tesoreria";
import {toast} from "react-toastify";


export const MovimientoBancario = ({actualizarSaldo}) => {

    const { register, handleSubmit, formState: {errors}, reset,watch } = useForm();
    const catalogo = useCatalogo([19]);

    const onSubmitMovimientoBancario = handleSubmit(async (data) => {
        data.usuario = dataG.usuario || globalData.usuario;
        data.operacion = watch('tipo_movimiento');
        data.monto_equivalente = watch('monto');
        data.moneda = 'MXP';
        data.sucursal = dataG.sucursal+"" || globalData.sucursal +"";
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");
        data.ticket = `MOVBAN${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`
        const encryptedData = encryptRequest(data);
        const response = await dotaSucursales(encryptedData);
        if(response.mensaje.includes("exitosamente")){
            OPTIONS.onClose = actualizarSaldo;
            toast.success(response.mensaje, OPTIONS);
            reset();
        }else{
            toast.error(response.mensaje, OPTIONS);
        }
    });


    return(
        <>
        <form
            className="text-center"
        >
            <div className="col-md-4 mx-auto">
                <div className="form-floating mb-3">
                    <select
                        {...register("tipo_movimiento", {
                            required: {
                                value: true,
                                message: "Debes de seleccionar al menos una tipo de movimiento.",
                            },
                            validate: (value) => {
                                return (
                                    value !== "0" || "Debes seleccionar una tipo de movimiento válido."
                                );
                            },
                        })}
                        className={`form-select ${!!errors?.tipo_movimiento ? "invalid-input" : ""}`}
                        id="tipo_movimiento"
                        name="tipo_movimiento"
                        aria-label="tipo_movimiento"
                    >
                        <option value="0">SELECCIONA UNA OPCIÓN</option>
                        {catalogo[0]?.map((ele) => (
                            <option
                                key={ele.id + "-" + ele.descripcion}
                                value={ele.id}
                            >
                                {ele.descripcion}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="tipo_movimiento">TIPO DE MOVIMIENTO</label>
                    {errors?.tipo_movimiento && (
                        <div className="invalid-feedback-custom">
                            {errors?.tipo_movimiento.message}
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
            <div className="col-md-2 mx-auto">
                <button
                    type="button"
                    className="m-2 btn btn-primary"
                    onClick={onSubmitMovimientoBancario}
                >
                    <i className="bi bi-save me-2"></i>
                    GUARDAR
                </button>
            </div>
            </form>
        </>
    );
}