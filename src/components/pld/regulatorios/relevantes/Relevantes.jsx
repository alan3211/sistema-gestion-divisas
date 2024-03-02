import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";

export const Relevantes = () => {

    const {register,formState:{errors}} =  useForm();
    const [meses, setMeses] = useState([]);
    const [anios, setAnios] = useState([]);

    useEffect(() => {
        // Obtenemos los nombres capitalizados de los meses
        const monthNames = Array.from({ length: 12 }, (_, index) => {
            const date = new Date(2000, index, 1); // Usamos el año 2000 como referencia
            const monthName = date.toLocaleString('default', { month: 'long' });
            return monthName.toUpperCase();
        });
        // Lógica para obtener la lista de años, por ejemplo, para los últimos 5 años
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

        setAnios(years);
        setMeses(monthNames);
    }, []);

    return (<>
        <div className="d-flex align-items-center justify-content-center mt-3">
            <div className="col-md-3 form-floating mb-3 me-4">
                <select
                    {...register("mes", {
                        required: {
                            value: true,
                            message: 'Debes de seleccionar un mes.'
                        }
                    })}
                    className={`form-select ${!!errors?.mes ? 'invalid-input' : ''}`}
                    id="mes"
                    name="mes"
                    aria-label="Mes"
                >
                    <option value="0">SELECCIONA UN MES</option>
                    {meses.map((mes, index) => (
                        <option key={index + 1} value={index + 1}>
                            {mes}
                        </option>
                    ))}
                </select>
                <label htmlFor="mes">MES</label>
                {errors?.mes && <div className="invalid-feedback-custom">{errors?.mes.message}</div>}
            </div>
            <div className="col-md-3 form-floating mb-3 me-4">
                <select
                    {...register("anio", {
                        required: {
                            value: true,
                            message: 'Debes de seleccionar un año.'
                        }
                    })}
                    className={`form-select ${!!errors?.anio ? 'invalid-input' : ''}`}
                    id="anio"
                    name="anio"
                    aria-label="Año"
                >
                    <option value="0">SELECCIONA UN AÑO</option>
                    {anios.map((anio) => (
                        <option key={anio} value={anio}>
                            {anio}
                        </option>
                    ))}
                </select>
                <label htmlFor="anio">AÑO</label>
                {errors?.anio && <div className="invalid-feedback-custom">{errors?.anio.message}</div>}
            </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
            <div className="col-md-12 mx-auto text-center">
                <button type="button" className="btn btn-primary mt-2 ms-2 me-2">
                    <span className="bi bi-search me-2" aria-hidden="true"></span>
                    CONSULTAR
                </button>
                <button type="button" className="btn btn-primary mt-2 ms-2 me-2">
                    <span className="bi bi-file-earmark-text me-2" aria-hidden="true"></span>
                    GENERAR REPORTE
                </button>
                <button type="button" className="btn btn-primary mt-2 ms-2 me-2">
                    <span className="bi bi-file-earmark-arrow-down me-2" aria-hidden="true"></span>
                    EXPORTAR A XML
                </button>
                <button type="button" className="btn btn-primary mt-2 ms-2 me-2">
                    <span className="bi bi-upload me-2" aria-hidden="true"></span>
                    CARGAR ACUSE
                </button>
            </div>
        </div>




    </>);
}