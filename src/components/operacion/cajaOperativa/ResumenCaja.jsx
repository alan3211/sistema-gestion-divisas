import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    DENOMINACIONES,
    eliminarDenominacionesConCantidadCero,
    encryptRequest, FormatoMoneda,
    formattedDateWS,
    getDenominacion,
    getDiferenciaDenominacion,
    mensajeSinElementos,
    obtenerArrayDifDenominaciones,
    obtenerObjetoDenominaciones,
    opciones,
} from "../../../utils";
import { dataG } from "../../../App";
import { toast } from "react-toastify";
import { entregaCaja } from "../../../services/operacion-caja";
import { ModalGenericTool } from "../../commons/modals";
import { getUsuariosSistema } from "../../../services";
import { MessageComponent } from "../../commons";


export const ResumenCaja = ({ data, moneda, setShowDetalle, tipo, refresh,resetForm }) => {

    const getPropiedad = (elemento) => {
        let propiedad='';
        if(elemento.Denominacion === '0.5'){
            propiedad = 'denominacion_p5';
        }else{
            propiedad = `denominacion_${parseInt(elemento.Denominacion)}`;
        }
        return propiedad;
    }
    const getPropiedadDif = (elemento) => {
        let propiedad='';
        if(elemento.Denominacion === '0.5'){
            propiedad = 'diferencia_p5';
        }else{
            propiedad = `diferencia_${parseInt(elemento.Denominacion)}`;
        }
        return propiedad;
    }

    // Inicializa billetesFisicos
    const billetesFisicosInicial = data.result_set.map((elemento) => {
        return {
            [getPropiedad(elemento)]:parseInt(elemento['Billetes Físicos']) || 0
        }
    });
    const [billetesFisicos, setBilletesFisicos] = useState(billetesFisicosInicial);
    const totalInicial = billetesFisicosInicial.reduce((total, elemento) => {
        const valor = parseInt(Object.values(elemento)[0]) || 0;
        return total + valor;
    }, 0);

    console.log("Total inicial de billetes físicos:", totalInicial);
    const [totalBilletesFisicos, setTotalBilletesFisicos] = useState(totalInicial);

    const reiniciaState = () => {
        setBilletesFisicos(billetesFisicosInicial);
    }

    const [showMessage, setShowMessage] = useState(false);

    const [totalDiferencia, setTotalDiferencia] = useState(0);

    const montosIniciales = data.result_set.map((elemento) => elemento['Monto'] || 0);

    const [totalDiferenciaMontos, setTotalDiferenciaMontos] = useState(0);

    const { register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,watch } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [datosEnvio, setDatosEnvio] = useState({});
    // Calcula el monto total para cada columna
    const calcularTotales = () => {
        const totales = Array(data.headers.length).fill(0);

        data.result_set.forEach((elemento) => {
            data.headers.forEach((header, index) => {
                if (typeof elemento[header] === 'number') {
                    if (header !== 'Denominacion') { // Excluir 'Denominacion' y 'Monto'
                        totales[index] += elemento[header];
                    } else {
                        totales[index] = 'Total'; // Para 'Denominacion' dejarlo vacío
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
        'No Billetes': 'bi bi-cash',
        Monto: 'bi bi-cash-coin',
        Entradas: 'bi bi-arrow-up-circle',
        Salidas: 'bi bi-arrow-down-circle',
        'Billetes Físicos': 'bi bi-cash',
        'Diferencia Billetes': 'bi bi-calculator',
        'Diferencia Monto': 'bi bi-calculator',
    };

    useEffect(() => {
        // Cuando el componente se monta, envía la función reset al padre
        resetForm(reiniciaState);
    }, [resetForm]);

    useEffect(() => {
        // Calcula el total de la columna "Billetes Físicos" y la diferencia
        const totalBilletes = billetesFisicos.reduce((total, elemento) => {
            const valor = parseInt(Object.values(elemento)[0]) || 0;
            return total + valor;
        }, 0);
        setTotalBilletesFisicos(totalBilletes);

        console.log("TOTAL BILLETES FISICOS: ", totalBilletesFisicos)
        console.log("BILLETES FISICOS USEEFFECT: ", billetesFisicos)

        const diferencias = data.result_set.map((elemento, index) => {
            const diferencia = elemento['No Billetes'] - billetesFisicos[index][getPropiedad(elemento)];
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

        console.log("Diferencias!: ",diferencias);

        // Calcula el total de diferencias usando map y luego reduce
        const totalDif = diferencias.map((valor) => valor.diferencia).reduce((total, valor) => total + valor, 0);
        setTotalDiferencia(totalDif);

        //Calcula el total de diferencia de monto
        const totalDifMontos = data.result_set.reduce((total, elemento, index) => {
            const newValue = billetesFisicos[index][getPropiedad(elemento)];
            const diferenciaMonto = (elemento.Denominacion * newValue)-elemento.Monto;
            return total + diferenciaMonto;
        }, 0);

        setTotalDiferenciaMontos(totalDifMontos);

    }, [billetesFisicos]);


    const onSubmit = handleSubmit(async (datos) => {
        console.log("Array de objetos:", datos);
        const usuario_traspaso = datos.usuario_traspaso || '';
        console.log("Diferencia", totalDiferencia);
        console.log("total_billetes", totalBilletesFisicos);
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        const cierreCaja = {
            noCliente: '',
            ticket_notaCredito: '',
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            moneda: moneda,
            traspaso: usuario_traspaso,
            diferencias: 0,
        }

        if (tipo === 'traspaso') {
            cierreCaja.ticket = `TRASPASO${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        } else {
            cierreCaja.ticket = `CIERRE${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
        }

        const formValuesD = getDenominacion(cierreCaja.moneda, datos)
        eliminarDenominacionesConCantidadCero(formValuesD);
        const formValuesDif = getDiferenciaDenominacion(cierreCaja.moneda, datos)
        eliminarDenominacionesConCantidadCero(formValuesDif);

        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = cierreCaja.moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'CIERRE';
        cierreCaja.diferencia = obtenerArrayDifDenominaciones(formValuesDif);
        cierreCaja.denominacion = [
            denominaciones,
        ]

        console.log("VALORES!!!", cierreCaja)
        if (totalDiferencia !== 0) {
            cierreCaja.ticket_notaCredito = `NOTACREDITO${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;
            setDatosEnvio(cierreCaja);
            setShowModal(true);
        } else {
            console.log("CIERRE FINAL: ", cierreCaja);
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
                refresh();
            }
        }
    });

    const onEnviaNotas = async () => {
        console.log("CIERRE FINAL: ", datosEnvio);
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
            refresh();
        }
    }


    const options = {
        showModal,
        closeCustomModal: () => { setShowModal(false); reset() },
        title: 'Notas a Favor',
        icon: 'bi-credit-card me-2',
        subtitle: 'Existen diferencias en los montos, ¿Aceptas tener saldo pendiente?.',
        size: ''
    };

    const [usuariosCombo, setUsuariosCombo] = useState([]);

    const obtieneUsuarios = async () => {

        const valores = {
            sucursal: dataG.sucursal,
            usuario: dataG.usuario
        }
        const encryptedData = encryptRequest(valores);

        const data_usuarios = await getUsuariosSistema(encryptedData);

        console.log("CAJEROS: ", data_usuarios)
        if (data_usuarios.hasOwnProperty("resultSize")) {
            setUsuariosCombo([]);
            setShowMessage(true);
        } else {
            setUsuariosCombo(data_usuarios);
            setShowMessage(false);
        }
    }


    useEffect(() => {
        obtieneUsuarios();
    }, []);


    return (
        <form onSubmit={onSubmit} className="text-center mt-2" style={{ fontSize: "12px" }}>
            {
                (tipo === 'traspaso' && !showMessage) && (
                    <div className="col-md-4 mx-auto">
                        <div className="form-floating mb-3">
                            <select
                                {...register("usuario_traspaso", {
                                    required: {
                                        value: true,
                                        message: "Debes de seleccionar al menos a un usuario.",
                                    },
                                })}
                                className={`form-select ${!!errors?.usuario_traspaso ? "invalid-input" : ""}`}
                                id="usuario_traspaso"
                                name="usuario_traspaso"
                                aria-label="Usuario"
                            >
                                <option value="0">SELECCIONA UNA OPCIÓN</option>
                                {usuariosCombo?.map((ele) => (
                                    <option
                                        key={ele.Usu + "-" + ele.Nombre}
                                        value={ele.Usu}
                                    >
                                        {ele.Nombre}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="usuario_traspaso">Cajeros</label>
                            {errors?.usuario_traspaso && (
                                <div className="invalid-feedback-custom">
                                    {errors?.usuario_traspaso.message}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
            {  (tipo === 'traspaso' && showMessage) ? (<div className="row d-flex justify-content-center">
                    <div className="col-md-4 mb-3">
                        <MessageComponent estilos={mensajeSinElementos}>
                            Solo se cuenta con un cajero, favor de abrir una nueva caja para poder realizar la operación de traspaso.
                        </MessageComponent>
                    </div>
                </div>)
                :   (<>
                    <h5 className="p-2 ">Denominación <strong>{DENOMINACIONES[moneda] || ''}</strong></h5>
                    <table className="table table-bordered table-hover table-responsive">
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
                                elemento['No Billetes'] === 0
                                    ? 'bi bi-exclamation-circle-fill text-danger'
                                    : elemento['No Billetes'] < 5
                                        ? 'bi bi-exclamation-triangle-fill text-warning'
                                        : 'bi bi-arrow-up-circle-fill text-success';

                            // Iconos para las columnas de Entradas y Salidas
                            const iconoEntradas = 'bi bi-arrow-up-circle-fill text-success';
                            const iconoSalidas = 'bi bi-arrow-down-circle-fill text-danger';

                            /*Calcula la diferencia del número de billetes con los físicos actuales*/
                            const diferencia = elemento['No Billetes'] - billetesFisicos[index][getPropiedad(elemento)];
                            const iconoDiferencia =
                                diferencia === 0
                                    ? 'bi bi-exclamation-circle-fill text-success'
                                    : diferencia < 5
                                        ? 'bi bi-exclamation-triangle-fill text-warning'
                                        : 'bi bi-exclamation-circle-fill text-danger';

                            /*Hace la diferencia entre el monto actual con el monto*/
                            const diferenciaMonto = (billetesFisicos[index][getPropiedad(elemento)] *  elemento.Denominacion) - elemento.Monto; // Calcular la diferencia de montos

                            return (
                                <tr key={elemento.Denominacion}>
                                    <td>{elemento.Denominacion}</td>
                                    <td>
                                        <i className={iconoNoBilletes}></i> {elemento['No Billetes']}
                                    </td>
                                    <td>
                                        {FormatoMoneda(elemento.Monto)}
                                    </td>
                                    <td>
                                        <i className={iconoEntradas}></i> {elemento.Entradas}
                                    </td>
                                    <td>
                                        <i className={iconoSalidas}></i> {elemento.Salidas}
                                    </td>
                                    {/* Columna de Billetes Físicos */}
                                    <td nowrap>
                                        <input
                                            {...register(`${getPropiedad(elemento)}`, {
                                                validate: {
                                                    validacionMN: (value) => /^[1-9]\d*$/.test(value) || value === 0,
                                                },
                                            })}
                                            type="text"
                                            name={`${getPropiedad(elemento)}`}
                                            className={` text-center form-control ${errors && errors[`${getPropiedad(elemento)}`] ? 'is-invalid' : ''}`}
                                            placeholder="$"
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                const newValue = /^[0-9]\d*$/.test(inputValue) ? inputValue : 0;
                                                setBilletesFisicos((prevBilletes) => {
                                                    const newBilletes = [...prevBilletes];
                                                    newBilletes[index][getPropiedad(elemento)] = parseInt(newValue);
                                                    return newBilletes;
                                                });

                                                const diferencia = elemento['No Billetes'] - newValue;
                                                setValue(`${getPropiedadDif(elemento)}`, diferencia);
                                                const diferenciaMonto = (elemento.Denominacion * newValue)-elemento.Monto;
                                                setValue(`diferenciaMonto_${elemento.Denominacion}`, diferenciaMonto);

                                            }}
                                            value={billetesFisicos[index][getPropiedad(elemento)]}
                                        />

                                    </td>
                                    <td>
                                        <i className={iconoDiferencia}></i> {diferencia}
                                    </td>
                                    <td>
                                        {FormatoMoneda(diferenciaMonto)}
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
                                    ) : ele === 'Diferencia Billetes' ? (
                                        <>
                                            {totalDiferencia}
                                        </>
                                    ) : ele === 'Diferencia Monto' ? (
                                        <>
                                            {FormatoMoneda(totalDiferenciaMontos)}
                                        </>
                                    ) : ele === 'Monto' ? (
                                        <>
                                            {FormatoMoneda(totales[index])}
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
                        <button type="submit" className="m-2 btn btn-primary" disabled={totalDiferencia  > 0}>
                              <span className="me-2">
                                GUARDAR
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
                </>)
            }
        </form>
    );
};
