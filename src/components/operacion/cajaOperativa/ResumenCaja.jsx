import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    eliminarDenominacionesConCantidadCero,
    encryptRequest,
    formattedDateWS,
    getDenominacion, getDiferenciaDenominacion, obtenerArrayDifDenominaciones, obtenerObjetoDenominaciones,
    opciones,
    validarMoneda,
    validarNumeros
} from "../../../utils";
import {dataG} from "../../../App";
import {accionesTesoreria} from "../../../services/tools-services";
import {toast} from "react-toastify";
import {entregaCaja} from "../../../services/operacion-caja";
import {ModalAccionesTool, ModalGenericTool} from "../../commons/modals";


export const ResumenCaja = ({ data,moneda,setShowDetalle }) => {
    // Inicializa billetesFisicos usando la información real de los datos si está disponible.
    const billetesFisicosInicial = data.result_set.map((elemento) => elemento['Billetes Físicos'] || 0);
    const [billetesFisicos, setBilletesFisicos] = useState(billetesFisicosInicial);

    const [totalBilletesFisicos, setTotalBilletesFisicos] = useState(
        billetesFisicosInicial.reduce((total, valor) => total + valor, 0)
    );
    const [totalDiferencia, setTotalDiferencia] = useState(0);
    const { register, handleSubmit,setValue,
    watch,formState:{errors},reset} = useForm();
    const [showModal, setShowModal] = useState(false);
    const [datosEnvio, setDatosEnvio] = useState({});
    // Calcula el monto total para cada columna
    const calcularTotales = () => {
        const totales = Array(data.headers.length).fill(0);

        data.result_set.forEach((elemento) => {
            data.headers.forEach((header, index) => {
                if (typeof elemento[header] === 'number') {
                    if(header !== 'Denominacion'){
                        totales[index] += elemento[header];
                    }else{
                        totales[index] = '';
                    }
                }
            });
        });

        return totales;
    };

    const totales = calcularTotales();

    // Iconos específicos para los encabezados
    const iconosEncabezados = {
        Denominacion: 'bi bi-tag',
        Entradas: 'bi bi-arrow-up-circle',
        Salidas: 'bi bi-arrow-down-circle',
        'No Billetes': 'bi bi-cash',
        'Billetes Físicos': 'bi bi-cash',
        Diferencia: 'bi bi-calculator',
    };

    useEffect(() => {
        // Calcula el total de la columna "Billetes Físicos" y la diferencia
        const totalBilletes = billetesFisicos.reduce((total, valor) => total + valor, 0);
        setTotalBilletesFisicos(totalBilletes);

        const diferencias = data.result_set.map((elemento, index) => {
            const diferencia = elemento['No Billetes'] - billetesFisicos[index];

            // Cambia el icono de "Diferencia" según las condiciones
            if (diferencia === 0) {
                return {
                    diferencia,
                    icono: 'bi bi-exclamation-circle-fill text-danger',
                };
            } else if (diferencia < 5) {
                return {
                    diferencia,
                    icono: 'bi bi-exclamation-triangle-fill text-warning',
                };
            } else {
                return {
                    diferencia,
                    icono: 'bi bi-arrow-up-circle-fill text-success',
                };
            }
        });

        // Calcula el total de diferencias usando map y luego reduce
        const totalDif = diferencias.map((valor) => valor.diferencia).reduce((total, valor) => total + valor, 0);

        setTotalDiferencia(totalDif);
    }, [billetesFisicos, data.result_set]);


    const onSubmit = handleSubmit(async(datos)=>{
        console.log("Array de objetos:", datos);
        console.log("Diferencia", totalDiferencia);
        console.log("total_billetes", totalBilletesFisicos);
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

            const cierreCaja = {
                noCliente:'',
                ticket:`CIERRE${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`,
                ticket_notaCredito:'',
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
                moneda: moneda,
                traspaso:'',
                diferencias:0,
            }

            const formValuesD = getDenominacion(cierreCaja.moneda,datos)
            eliminarDenominacionesConCantidadCero(formValuesD);

            const formValuesDif = getDiferenciaDenominacion(cierreCaja.moneda,datos)
            eliminarDenominacionesConCantidadCero(formValuesDif);

            const denominaciones = obtenerObjetoDenominaciones(formValuesD);
            denominaciones.divisa = cierreCaja.moneda;
            denominaciones.tipoOperacion = '0';
            denominaciones.movimiento = 'CIERRE';
            cierreCaja.diferencia = obtenerArrayDifDenominaciones(formValuesDif);
            cierreCaja.denominacion = [
                denominaciones,
            ]
        if(totalDiferencia !== 0){
            cierreCaja.ticket_notaCredito = `NOTACREDITO${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
            setDatosEnvio(cierreCaja)
            setShowModal(true);
        }else{
            console.log("CIERRE FINAL: ",cierreCaja);
            const encryptedData = encryptRequest(cierreCaja);
            const response = await entregaCaja(encryptedData);

            if (response !== '') {
                toast.success(response, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "light",
                });
                reset();
                setShowDetalle(false);
            }
        }
    });

    const onEnviaNotas = async () => {
        console.log("CIERRE FINAL: ",datosEnvio);
        const encryptedData = encryptRequest(datosEnvio);
        const response = await entregaCaja(encryptedData);

        if (response !== '') {
            toast.success(response, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "light",
            });
            reset();
            options.closeCustomModal();
            setShowDetalle(false);
        }
    }


    const options = {
        showModal,
        closeCustomModal: () => {setShowModal(false); reset()},
        title: 'Notas a Favor',
        icon: 'bi-credit-card me-2',
        subtitle:'Existen diferencias en los montos, ¿Aceptas tener saldo pendiente?.',
        size:''
    };


    return (
        <form onSubmit={onSubmit} className="table-responsive text-center mt-2" style={{fontSize:"12px"}}>
            <table className="table table-bordered table-hover">
                <thead className="table-blue">
                <tr>
                    {data.headers?.map((elemento, index) => (
                        <th className="col-1" key={elemento}>
                            <i className={iconosEncabezados[elemento]}></i> {elemento}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.result_set?.map((elemento, index) => {
                    const iconoNoBilletes =
                        elemento['No Billetes'] < 5
                            ? 'bi bi-exclamation-triangle-fill text-warning'
                            : 'bi bi-arrow-up-circle-fill text-success';

                    // Iconos para las columnas de Entradas y Salidas
                    const iconoEntradas = 'bi bi-arrow-up-circle-fill text-success';
                    const iconoSalidas = 'bi bi-arrow-down-circle-fill text-danger';

                    const diferencia = elemento['No Billetes'] - billetesFisicos[index];
                    const iconoDiferencia =
                        diferencia === 0
                            ? 'bi bi-arrow-up-circle-fill text-success'
                            : diferencia < 5
                                ? 'bi bi-exclamation-triangle-fill text-warning'
                                : 'bi bi-exclamation-circle-fill text-danger';

                    return (
                        <tr key={elemento.Denominacion}>
                            <td>{elemento.Denominacion}</td>
                            <td>
                                <i className={iconoEntradas}></i> {elemento.Entradas}
                            </td>
                            <td>
                                <i className={iconoSalidas}></i> {elemento.Salidas}
                            </td>
                            <td>
                                <i className={iconoNoBilletes}></i> {elemento['No Billetes']}
                            </td>
                            {/* Columna de Billetes Físicos */}
                            <td>
                                <input
                                    {...register(`denominacion_${elemento.Denominacion}`, {
                                        validate: {
                                            validacionMN: (value) => validarNumeros(`denominacion_${elemento.Denominacion}`,value),
                                        }}
                                    )
                                    }
                                    type="number"
                                    min={0}
                                    name={`denominacion_${elemento.Denominacion}`}
                                    className={`form-control ${errors && errors[`denominacion_${elemento.Denominacion}`] ? 'is-invalid' : ''}`}
                                    placeholder="0"
                                    onChange={(e) => {
                                        const fieldName = `denominacion_${elemento.Denominacion}`;
                                        const newValue = parseInt(e.target.value, 10);
                                        setBilletesFisicos((prevBilletes) => {
                                            const newBilletes = [...prevBilletes];
                                            newBilletes[index] = newValue;
                                            return newBilletes;
                                        });
                                        const diferencia = elemento['No Billetes'] - newValue;
                                        setValue(`diferencia_${elemento.Denominacion}`, diferencia);
                                    }}
                                />
                            </td>
                            {/* Columna de Input de Diferencia */}
                            <td>
                                <i className={iconoDiferencia}></i> {diferencia}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
                <tfoot>
                <tr>
                    {data.headers?.map((ele, index) => (
                        <th key={ele}>
                            {ele === 'Billetes Físicos' ? (
                                <>
                                    {totalBilletesFisicos}
                                </>
                            ) : ele === 'Diferencia' ? (
                                <>
                                    {totalDiferencia}
                                </>
                            ) : (
                                totales[index]
                            )}
                        </th>
                    ))}
                </tr>
                </tfoot>
            </table>
            <div className="col-md-12">
                <button type="submit" className="m-2 btn btn-primary">
                              <span className="me-2">
                                Guardar
                                <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                              </span>
                </button>
            </div>
            {
                showModal && (
                    <ModalGenericTool options={options}>
                        <div className="col-md-12 d-flex justify-content-center">
                            <button type="button" className="m-2 btn btn-success" onClick={onEnviaNotas}>
                              <span className="me-2">
                                <span className="bi bi-check-circle me-2" role="status" aria-hidden="true"></span>
                                  Sí
                              </span>
                            </button>
                            <button type="button" className="m-2 btn btn-danger" onClick={options.closeCustomModal}>
                              <span className="me-2">
                                <span className="bi bi-x-circle me-2" role="status" aria-hidden="true"></span>
                                  No
                              </span>
                            </button>
                        </div>
                    </ModalGenericTool>
                )
            }
        </form>
    );
};
