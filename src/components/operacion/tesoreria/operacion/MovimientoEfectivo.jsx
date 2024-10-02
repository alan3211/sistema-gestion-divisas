import {encryptRequest, formattedDateWS, globalData, opciones, OPTIONS, validarMoneda} from "../../../../utils";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../../hook";
import {dataG} from "../../../../App";
import {dotaEfectivo, dotaSucursales} from "../../../../services/operacion-tesoreria";
import {toast} from "react-toastify";


export const MovimientoEfectivo = ({actualizarSaldo,moneda}) => {

    const { register,
        handleSubmit,
        formState: {errors},
        reset,watch,
        trigger,
        setValue,
    } = useForm();
    const catalogo = useCatalogo([31]);

    const onSubmitMovimientoBancario = handleSubmit(async (data) => {
        data.usuario = dataG.usuario || globalData.usuario;
        data.operacion = watch('tipo_movimiento');
        data.tipo_cambio = moneda === 'USD' ? watch('tipo_cambio') : 0.0
        data.moneda = moneda;
        data.sucursal = dataG.sucursal+"" || globalData.sucursal +"";
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");
        data.ticket = `MOVEFE${dataG.sucursal}${dataG.usuario}${formattedDateWS()}${horaOperacion}`
        const encryptedData = encryptRequest(data);
        const response = await dotaEfectivo(encryptedData);
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
            className="text-center" onSubmit={(e)=> e.preventDefault()}
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
                            validate: {
                                moneda: (value) =>
                                    validarMoneda("Monto", value),
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
                        onChange={(e) => {
                            // Actualiza el valor del campo de entrada
                            e.preventDefault();
                            setValue("monto", e.target.value);
                            trigger("monto")
                        }}
                    />
                    <label htmlFor="monto" className="form-label">
                        MONTO
                    </label>
                    {errors?.monto && (
                        <div className="invalid-feedback">{errors?.monto.message}</div>
                    )}
                </div>
            </div>
            {moneda === 'USD' && (<div className="col-md-4 mx-auto">
                <div className="form-floating mb-3">
                    <div className="col-md-12 form-floating mb-3">
                        <input
                            {...register("tipo_cambio", {
                                required: {
                                    value: true,
                                    message: 'Debes de ingresar un tipo de cambio.'
                                },
                                validate: {
                                    moneda: (value) => validarMoneda(`Tipo de Cambio`, value),
                                },
                            })}
                            type="text"
                            className={`form-control ${errors && errors.tipo_cambio ? "is-invalid" : ""}`}
                            name='tipo_cambio'
                            placeholder="$"
                            autoComplete="off"
                            tabIndex="1"
                            onChange={(e) => {
                                // Actualiza el valor del campo de entrada
                                e.preventDefault();
                                setValue("tipo_cambio", e.target.value);
                                trigger("tipo_cambio")
                            }}
                        />
                        <label htmlFor="tipo_cambio">TIPO DE CAMBIO</label>
                        {errors && errors.tipo_cambio && (
                            <div className="invalid-feedback">
                                {errors.tipo_cambio.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>)}
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