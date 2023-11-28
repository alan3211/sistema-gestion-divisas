import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";
import {encryptRequest, OPTIONS} from "../../../utils";
import {generaSolicitudDotacionBoveda, solicitaDotacionBoveda} from "../../../services/operacion-logistica";
import {useContext, useState} from "react";
import {TableComponent} from "../../commons/tables";
import {DotacionesProvider} from "../../../context/dotaciones/DotacionesProvider";
import {DotacionesContext} from "../../../context/dotaciones/DotacionesContext";
import {dataG} from "../../../App";
import {toast} from "react-toastify";

export const SolicitaDotacionBoveda = ({perfil}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        watch,
    } = useForm();
    const [showTable, setShowTable] = useState(false);
    const [data, setData] = useState(false);
    const catalogo = useCatalogo([15]);
    const {montoSolicitado,cleanMontos} = useContext(DotacionesContext);

    const onSubmitDotacionBoveda = async () => {
        const selectedMoneda = watch("moneda");
        console.log("Moneda seleccionada:", selectedMoneda);
        const values = {
            moneda: selectedMoneda,
        };
        const encryptedData = encryptRequest(values);
        const response = await solicitaDotacionBoveda(encryptedData);
        if (response.total_rows > 0) {
            setData(response);
        } else {
            setData([]);
        }
        setShowTable(true);
    };

    const handleMonedaChange = (event) => {
        if (event.target.value === "") return;
        setValue("moneda", event.target.value);
        onSubmitDotacionBoveda();
    };

    const options = {
        showMostrar: true,
        buscar: true,
        paginacion: true,
        tools: [
            {columna: "Estatus", tool: "estatus"},
            {columna: "Monto a Solicitar", tool: "monto-solicitud"},
        ],
    };

    const guardaMontos = async () => {
        console.log(montoSolicitado)

        const valores = {
            moneda: watch("moneda"),
            usuario: dataG.usuario,
            montos: montoSolicitado
        }

        const encryptedData = encryptRequest(valores);

        const response = await generaSolicitudDotacionBoveda(encryptedData)

        if(response){
            toast.success(response,OPTIONS);
        }else {
            toast.error('Hubo un problema con la solicitud, intentelo de nuevo o más tarde.',OPTIONS);
        }
        cleanMontos();
    }

    return (
        <>
            <div className="row align-content-center">
                <div className="col-md-3 mx-auto">
                    <div className="form-floating mb-3">
                        <select
                            {...register("moneda", {
                                required: {
                                    value: true,
                                    message: "Debes seleccionar al menos una moneda.",
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
                            onChange={handleMonedaChange}
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
            </div>
            {showTable && (
                <>
                    <div className="row">
                        <div className="col-md-4 mx-auto">
                            <TableComponent data={data} options={options}/>
                        </div>
                    </div>
                    <div className="row text-center justify-content-center">
                        <div className="col-md-6">
                            <button type="button" onClick={guardaMontos} className="btn btn-primary">
                                GUARDAR
                                <i className="bi bi-save ms-2"></i>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
