import {encryptRequest, formattedDateWS, globalData, opciones, validarMoneda} from "../../../../utils";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../../hook/useCatalogo";
import {dataG} from "../../../../App";
import {dotaSucursales} from "../../../../services/operacion-tesoreria";
import {toast} from "react-toastify";
import {useSaldo} from "../../../../hook/useSaldo";

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
        if(response.mensaje !== ''){
            toast.success(response.mensaje, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
                onClose: actualizarSaldo,
            });
            reset();
        }
    });


    return(
        <>
        <form
            className="text-center"
            onSubmit={onSubmitMovimientoBancario}
            noValidate
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
                    <label htmlFor="tipo_movimiento">Tipo de Movimiento</label>
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
                    />
                    <label htmlFor="monto" className="form-label">
                        Monto
                    </label>
                    {errors?.monto && (
                        <div className="invalid-feedback">{errors?.monto.message}</div>
                    )}
                </div>
            </div>
            <div className="col-md-2 mx-auto">
                <button
                    type="submit"
                    className="m-2 btn btn-primary"
                >
                    <i className="bi bi-save me-2"></i>
                    Guardar
                </button>
            </div>
            </form>
        </>
    );
}