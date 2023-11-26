import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";
import {dataG} from "../../../App";
import {encryptRequest, formattedDateWS, globalData, opciones, OPTIONS} from "../../../utils";
import {dotaSucursales} from "../../../services/operacion-tesoreria";
import {toast} from "react-toastify";

export const SolicitaDotacionBoveda = ({perfil}) => {

    const { register, handleSubmit, formState: {errors}, reset } = useForm();
    const catalogo = useCatalogo([4]);

    const onSubmitDotacionBoveda = handleSubmit(async (data) => {
        const encryptedData = encryptRequest(data);
        const response = await dotaSucursales(encryptedData);
        if(response.mensaje.includes("exitosamente")){
            toast.success(response.mensaje, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored"
            });
            reset();
        }else{
            toast.error(response.mensaje, OPTIONS);
        }
    });


    return(
        <form
            className="text-center"
            noValidate
        >
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
                        className={`form-select ${!!errors?.moneda ? "invalid-input" : ""}`}
                        id="moneda"
                        name="moneda"
                        aria-label="Moneda"
                        onChange={onSubmitDotacionBoveda}
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
                    <label htmlFor="moneda">DIVISA</label>
                    {errors?.moneda && (
                        <div className="invalid-feedback-custom">
                            {errors?.moneda.message}
                        </div>
                    )}
                </div>
            </div>
        </form>

    );
}