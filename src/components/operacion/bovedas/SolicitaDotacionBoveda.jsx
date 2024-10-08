import {useForm} from "react-hook-form";
import {useCatalogo} from "../../../hook";
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest,
    formattedDateWS,
    getDenominacion, obtenerObjetoDenominaciones,
    opciones,
    OPTIONS,
    validarMoneda, validarMonedaUSD
} from "../../../utils";
import {generaSolicitudDotacionBoveda, solicitaDotacionBoveda} from "../../../services/operacion-logistica";
import {useContext, useState} from "react";
import {TableComponent} from "../../commons/tables";
import {ModalGenericTool,ModalLoading} from "../../commons/modals";
import {Denominacion} from "../denominacion";
import {dataG} from "../../../App";
import {toast} from "react-toastify";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";


export const SolicitaDotacionBoveda = ({perfil}) => {
    const {
        register,
        formState: {errors},
        setValue,
        watch,
    } = useForm();
    const solicitaDenominacionB = useForm();
    const [showTable, setShowTable] = useState(false);
    const [data, setData] = useState(false);
    const catalogo = useCatalogo([15]);
    const [showSolicitaDenominacion,setShowSolicitaDenominacion] = useState(false);
    const [dataItem,setDataItem] = useState({});
    const [totalMonto,setTotalMonto] = useState(1);
    const [guarda,setGuarda] = useState(false);
    const [habilita,setHabilita] =  useState({
        recibe: true,
        entrega: true,
    });
    const {denominacionB} = useContext(DenominacionContext);

    const onSubmitDotacionBoveda = async () => {
        const selectedMoneda = watch("moneda");
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
        excel:true,
        buscar: true,
        paginacion: true,
        tools: [
            {columna: "Estatus", tool: "estatus"},
            {columna: "Monto a Solicitar", tool: "detalle-solicitud",deps:{setShowSolicitaDenominacion,setDataItem}},
        ],
        filters:[{columna:'Saldo',filter:'currency'}],
        tableName:'Consulta de Solicitud de Dotación a Boveda',
        disabledColumnsExcel:['Monto a Solicitar']
    };

    const OPTIONS_SOLICITUD_DOTACION = {
        size: 'xl',
        showModal: () => setShowSolicitaDenominacion(true),
        closeModal: () => {
            setShowSolicitaDenominacion(false);
            solicitaDenominacionB.reset();
            denominacionB.reset();
        },
        icon:'bi bi-currency-exchange text-success me-2',
        title:`Solicita Denominación en ${dataItem.Moneda} para la bóveda de ${dataItem.Boveda} de la ETV ${dataItem.Empresa}`,
        subtitle:'Selecciona el monto y las denominaciones necesarias para concluir la operación.'
    }

    const optionsSolDot = {
        importe: parseFloat(solicitaDenominacionB.watch('monto')),
        habilita,
        setHabilita,
        setTotalMonto,
    }

    const optionsLoad = {
        showModal:guarda,
        closeCustomModal: ()=> setGuarda(false),
        title:'Enviando solicitud al tesorero...'
    }

    const terminarDotacion = solicitaDenominacionB.handleSubmit(async(data)=>{
        setGuarda(true);
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");
        data.ID = dataItem.Id;
        data.Boveda = dataItem.Boveda;
        data.Empresa = dataItem.Empresa;
        data.moneda = dataItem.Moneda;
        data.operacion = 'DOTACION BOVEDA';
        data.usuario = dataG.usuario;
        data.ticket = `DOTBOV${dataG.usuario}${formattedDateWS()}${horaOperacion}`;

        let denominacionesDotacion = denominacionB.getValues();
        const formValuesB = getDenominacion(data.moneda,denominacionesDotacion)
        eliminarDenominacionesConCantidadCero(formValuesB);
        const denominaciones = obtenerObjetoDenominaciones(formValuesB);
        denominaciones.divisa = dataItem.Moneda;
        denominaciones.movimiento = 'SOLICITUD BOVEDA';

        data.denominacion = [
                denominaciones,
        ]

        const encryptedData = encryptRequest(data);
        const resultado = await generaSolicitudDotacionBoveda(encryptedData);

        if(resultado){
            setGuarda(false);
            toast.success(resultado,OPTIONS);
            solicitaDenominacionB.reset();
            denominacionB.reset();
            setShowSolicitaDenominacion(false);
        }else {
            toast.error('Hubo un problema con la solicitud, intentelo de nuevo o más tarde.',OPTIONS);
        }
    });


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
                <div className="row">
                    <div className="col-md-12">
                        <TableComponent data={data} options={options}/>
                    </div>
                </div>
            )}
            {
                showSolicitaDenominacion && (
                    <ModalGenericTool options={OPTIONS_SOLICITUD_DOTACION}>
                        <div className="row">
                            <div className="col-md-4 mx-auto">
                                <div className="form-floating">
                                    <input
                                        {...solicitaDenominacionB.register("monto",{
                                            validate: {
                                                validacionMoneda: (value) => {
                                                    if (watch("moneda") === 'USD') {
                                                        return validarMonedaUSD("Monto",value);
                                                    } else {
                                                        return validarMoneda("Monto",value);
                                                    }
                                                },
                                            }
                                        })}
                                        type="text"
                                        className={`form-control ${!!solicitaDenominacionB.formState.errors?.monto ? 'invalid-input':''}`}
                                        id="monto"
                                        name="monto"
                                        placeholder="Ingresa el monto"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            // Actualiza el valor del campo de entrada
                                            e.preventDefault();
                                            solicitaDenominacionB.setValue("monto", e.target.value);
                                            solicitaDenominacionB.trigger("monto")
                                        }}
                                        tabIndex="1"
                                    />
                                    <label htmlFor="monto">MONTO</label>
                                    {
                                        solicitaDenominacionB.formState.errors?.monto && <div className="invalid-feedback-custom">{solicitaDenominacionB.formState.errors?.monto.message}</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row m-1 g-3">
                                <div className="d-flex justify-content-center">
                                    <Denominacion type="B" moneda={dataItem.Moneda} options={optionsSolDot}/>
                                </div>
                                <div className="col-md-12 d-flex justify-content-center">
                                    <button type="button"
                                            className="btn btn-primary"
                                            onClick={terminarDotacion}
                                            disabled={totalMonto !== parseFloat(solicitaDenominacionB.watch("monto"))}>
                                        <span className="bi bi-check-circle me-2" aria-hidden="true"></span>
                                        ENVIAR SOLICITUD
                                    </button>
                                </div>
                        </div>
                        {
                            guarda && <ModalLoading options={optionsLoad} />
                        }
                    </ModalGenericTool>
                )
            }
        </>
    );
};
