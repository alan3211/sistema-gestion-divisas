import {CardLayout, Layout} from "../../commons";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";

export const PerfilTransaccional = () => {

    const {register,formState:{errors}} =  useForm();
    const [meses, setMeses] = useState([]);
    const [anios, setAnios] = useState([]);
    const navigate = useNavigate();
    const catalogo = useCatalogo([30])

    console.log(catalogo)

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

    const moduleName= {
        title: 'PLD',
        module: "Perfil Transaccional",
        icon: "ri ri-user-settings-line me-2"
    };

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);

    return(
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.module} icon={moduleName.icon}>
                <div className="row mt-3">
                    <div className="col-md-5 mx-auto">
                        <div className="form-floating mb-3">
                            <select
                                {...register("tipo_alerta", {
                                    required: {
                                        value: true,
                                        message: 'Debes de seleccionar al menos un tipo de alerta.'
                                    },
                                    validate: value => {
                                        return value !== "0" || 'Debes seleccionar un tipo de alerta válido.';
                                    }
                                })}
                                className={`form-select ${!!errors?.tipo_alerta ? 'invalid-input' : ''}`}
                                id="tipo_alerta"
                                name="tipo_alerta"
                                aria-label="Tipo Alerta"
                            >
                                <option value="">SELECCIONA UNA OPCIÓN</option>
                                {
                                    catalogo[0]?.map((ele) => (
                                        <option key={ele.Id + '-' + ele.descripcion}
                                                value={ele.Id}>
                                            {ele.descripcion}
                                        </option>
                                    ))
                                }
                            </select>
                            <label htmlFor="tipo_reporte">TIPO DE ALERTA</label>
                            {
                                errors?.tipo_alerta &&
                                <div className="invalid-feedback-custom">{errors?.tipo_alerta.message}</div>
                            }
                        </div>
                    </div>
                </div>
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
                    </div>
                </div>
            </CardLayout>
        </Layout>
    );
}