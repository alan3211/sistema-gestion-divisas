import {useContext} from "react";
import {CargaTipoCambioContext} from "../../../context/CargaTipoCambio/CargaTipoCambioContext";
import {AltaDivisas} from "./AltaDivisas";
import {useCatalogo} from "../../../hook/useCatalogo";
import USASVG from "../../../assets/USA.svg";
import EuroSVG from "../../../assets/Europa.svg";
import LibraSVG from "../../../assets/GranBretana.svg";

export const CargaTipoCambioOpera = () => {

    const {showTab, register,handleSubmit, errors,currencies} = useContext(CargaTipoCambioContext);
    const catalogo = useCatalogo([16, 17])

    const onSubmit = handleSubmit((data) => {
        const updatedTipoCambio = currencies.map((currency) => {
            const compraValue = data[`compra_${currency.divisa}`];
            const ventaValue = data[`venta_${currency.divisa}`];

            if (compraValue !== "" || ventaValue !== "") {
                return {
                    [`compra_${currency.divisa}`]: compraValue === "" ? 0.0 : parseFloat(compraValue),
                    [`venta_${currency.divisa}`]: ventaValue === "" ? 0.0 : parseFloat(ventaValue),
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
            if (key.startsWith("compra_") || key.startsWith("venta_")) {
                delete updatedData[key];
            }
        }

        console.log(updatedData);

    });


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    showTab.tab2
                    && (
                        <div className="col-md-3">
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
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        catalogo[0]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="region">Región</label>
                                {
                                    errors?.region &&
                                    <div className="invalid-feedback-custom">{errors?.region.message}</div>
                                }
                            </div>
                        </div>
                    )
                }
                {
                    showTab.tab3
                    && (
                        <div className="col-md-3">
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
                                    <option value="0">Selecciona una opción</option>
                                    {
                                        catalogo[1]?.map((ele) => (
                                            <option key={ele.id + '-' + ele.descripcion}
                                                    value={ele.id}>
                                                {ele.descripcion}
                                            </option>
                                        ))
                                    }
                                </select>
                                <label htmlFor="sucursal">Sucursal</label>
                                {
                                    errors?.sucursal &&
                                    <div className="invalid-feedback-custom">{errors?.sucursal.message}</div>
                                }
                            </div>
                        </div>
                    )
                }
                <AltaDivisas/>
                <button type="submit" className="btn btn-primary">
                    <i className="bi bi-save me-1"></i> Guardar
                </button>
            </form>

        </>
    )
}