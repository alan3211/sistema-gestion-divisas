import {useContext} from "react";
import {CargaTipoCambioContext} from "../../../context/CargaTipoCambio/CargaTipoCambioContext";
import {AltaDivisas} from "./AltaDivisas";
import {useCatalogo} from "../../../hook";
import {getCargaTipoCambio} from "../../../services/administracion-services";
import {encryptRequest, formattedDate} from "../../../utils";
import {toast} from "react-toastify";

export const CargaTipoCambioOpera = ({id}) => {

    const {tipo, register,handleSubmit, errors,currencies} = useContext(CargaTipoCambioContext);
    const catalogo = useCatalogo([16, 17])

    const onSubmit = handleSubmit(async(data) => {

        const updatedTipoCambio = currencies.map((currency) => {

            const compraValue = data[`compra_${currency.divisa}`];
            const ventaValue = data[`venta_${currency.divisa}`];

            if (compraValue !== "" || ventaValue !== "") {
                return {
                    compra: compraValue === "" ? 0.0 : compraValue,
                    venta: ventaValue === "" ? 0.0 : ventaValue,
                    divisa: currency.divisa,
                    fecha: formattedDate,
                };
            } else {
                return null; // No agrega al arreglo si ambos valores son vacíos
            }
        }).filter(item => item !== null);

        const updatedData = {
            ...data,
            tipoCambio: updatedTipoCambio,
        };

        // Elimina las propiedades vacías en "updatedData" que comienzan con "compra_" o "venta_"
        for (const key in updatedData) {
            if (key.startsWith("compra") || key.startsWith("venta") || key.startsWith("divisa")) {
                delete updatedData[key];
            }
        }

        updatedData.opcion = tipo;

        if(updatedData.tipoCambio.length === 0){
            toast.error('No se han ingresado tipos de cambio.',{
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
        }else{
            const respuesta = await getCargaTipoCambio(encryptRequest(updatedData));
            console.log("Respuesta: ",respuesta)
            toast.success(respuesta.mensaje,{
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
        }
    });

    return (
        <>
            <form onSubmit={onSubmit}>
                {
                    id === 'Region'
                    && (
                        <div className="d-flex align-items-center justify-content-center mt-5">
                            <div className="form-floating mb-3">
                                <select
                                    {...register("region", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos una región.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una región válida.';
                                        }
                                    })}
                                    className={`form-select ${!!errors?.region ? 'invalid-input' : ''}`}
                                    id="region"
                                    name="region"
                                    aria-label="Región"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[0]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="region">REGIÓN</label>
                                {
                                    errors?.region &&
                                    <div className="invalid-feedback-custom">{errors?.region.message}</div>
                                }
                            </div>
                        </div>
                    )
                }
                {
                    id === 'Sucursal'
                    && (
                        <div className="d-flex align-items-center justify-content-center mt-5">
                            <div className="form-floating mb-3">
                                <select
                                    {...register("sucursal", {
                                        required: {
                                            value: true,
                                            message: 'Debes de seleccionar al menos una sucursal.'
                                        },
                                        validate: value => {
                                            return value !== "0" || 'Debes seleccionar una sucursal válida.';
                                        }
                                    })}
                                    className={`form-select ${!!errors?.sucursal ? 'invalid-input' : ''}`}
                                    id="sucursal"
                                    name="sucursal"
                                    aria-label="Sucursal"
                                >
                                    <option value="0">SELECCIONA UNA OPCIÓN</option>
                                    {
                                        catalogo[1]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="sucursal">SUCURSAL</label>
                                {
                                    errors?.sucursal &&
                                    <div className="invalid-feedback-custom">{errors?.sucursal.message}</div>
                                }
                            </div>
                        </div>
                    )
                }
                <AltaDivisas/>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save me-1"></i> GUARDAR
                    </button>
                </div>
            </form>
        </>
    )
}