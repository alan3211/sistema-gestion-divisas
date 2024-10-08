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
    opciones, OPTIONS,
} from "../../../utils";
import { dataG } from "../../../App";
import { toast } from "react-toastify";
import { entregaCaja } from "../../../services/operacion-caja";
import { getUsuariosSistema } from "../../../services";
import { MessageComponent } from "../../commons";
import {ModalLoading} from "../../commons/modals/ModalLoading";
import {ModalGenericTool} from "../../commons/modals";


export const ResumenCaja = ({ data, moneda, setShowDetalle, tipo, refresh,resetForm }) => {

    const [guarda,setGuarda] = useState(false);
    const [showDiferencias, setShowDiferencias] = useState(false);
    const [cierraCajaForm, setCierraCajaForm] = useState({});
    const getPropiedad = (property,elemento) => {
        let propiedad='';
        if(elemento.Denominacion === '0.05'){
            propiedad = `${property}_p05`;
        }else if(elemento.Denominacion === '0.10'){
            propiedad = `${property}_p1`;
        }else if(elemento.Denominacion === '0.20'){
            propiedad = `${property}_p2`;
        }else if(elemento.Denominacion === '0.50'){
            propiedad = `${property}_p5`;
        }else{
            propiedad = `${property}_${parseInt(elemento.Denominacion)}`;
        }
        return propiedad;
    }

    // Inicializa billetesFisicos
    const billetesFisicosInicial = data.result_set.map((elemento) => {
        return {
            [getPropiedad('denominacion',elemento)]:parseInt(elemento['Billetes Físicos']) || 0
        }
    });
    const [billetesFisicos, setBilletesFisicos] = useState(billetesFisicosInicial);
    const totalInicial = billetesFisicosInicial.reduce((total, elemento) => {
        const valor = parseInt(Object.values(elemento)[0]) || 0;
        return total + valor;
    }, 0);

    const [totalBilletesFisicos, setTotalBilletesFisicos] = useState(totalInicial);

    const validaMontosIniciales = data.result_set.map((elemento) => {
        return {
            [getPropiedad('denominacion', elemento)]: true
        }
    });

    const [difParcial,setDifParcial] = useState(validaMontosIniciales);

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
        trigger,
        formState: { errors },
        reset } = useForm();
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

        const diferencias = data.result_set.map((elemento, index) => {
            const diferencia = elemento['No Billetes'] - billetesFisicos[index][getPropiedad('denominacion',elemento)];
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

        //Calcula el total de diferencia de monto
        const totalDifMontos = data.result_set.reduce((total, elemento, index) => {
            const newValue = billetesFisicos[index][getPropiedad('denominacion',elemento)];
            const diferenciaMonto = (elemento.Denominacion * newValue)-elemento.Monto;
            const resultado = parseFloat(total) + parseFloat(diferenciaMonto);
            return resultado.toFixed(2);
        }, 0);

        setTotalDiferenciaMontos(parseFloat(totalDifMontos));

    }, [billetesFisicos]);

    const optionsLoad = {
        showModal:guarda,
        closeCustomModal: ()=> setGuarda(false),
        title:'Guardando...'
    }

    const optionsModal = {
        size:'md',
        showModal: showDiferencias,
        closeModal: () => setShowDiferencias(false),
        title: 'Cierre de Caja',
        icon: 'bi bi-cash m-2 text-blue',
        subtitle: 'Existen diferencias en los montos, ¿Desea enviar el cierre de caja al supervisor?'
    };

    const onSubmit = handleSubmit(async (datos) => {
        const usuario_traspaso = datos.usuario_traspaso || '';
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
            cierreCaja.ticket = `TRASPASO${dataG.sucursal}${dataG.usuario}${formattedDateWS()}${horaOperacion}`;
        } else {
            cierreCaja.ticket = `CIERRE${dataG.sucursal}${dataG.usuario}${formattedDateWS()}${horaOperacion}`;
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

        cierreCaja.totalDiferenciaMonto = totalDiferenciaMontos;
        cierreCaja.totalDiferenciaBilletes = totalDiferencia;

        if (totalDiferencia !== 0) {
            cierreCaja.ticket_notaCredito = `NOTACREDITO${dataG.sucursal}${dataG.usuario}${formattedDateWS()}${horaOperacion}`;
            setShowDiferencias(true);
            setCierraCajaForm(cierreCaja);
        } else if(totalDiferencia !== 0 && parseFloat(totalDiferenciaMontos) === 0){
            cierreCaja.ticket_notaCredito = `NOTACREDITO${dataG.sucursal}${dataG.usuario}${formattedDateWS()}${horaOperacion}`;
            setShowDiferencias(true);
            setCierraCajaForm(cierreCaja)
        } else if(totalDiferencia === 0 && parseFloat(totalDiferenciaMontos) !== 0){
            cierreCaja.ticket_notaCredito = `NOTACREDITO${dataG.sucursal}${dataG.usuario}${formattedDateWS()}${horaOperacion}`;
            setShowDiferencias(true);
            setCierraCajaForm(cierreCaja)
        } else{
            setShowDiferencias(false);
            const encryptedData = encryptRequest(cierreCaja);
            setGuarda(true)
            const response = await entregaCaja(encryptedData);

            if (response !== '') {
                setGuarda(false)
                toast.success(response, OPTIONS);
                reset();
                setShowDetalle(false);
                refresh();
                options.closeCustomModal();
            }
        }
    });

    const cierraCajaDiferencias = async() => {
        const encryptedData = encryptRequest(cierraCajaForm);
        setGuarda(true)
        const response = await entregaCaja(encryptedData);

        if (response !== '') {
            setGuarda(false)
            toast.success(response, OPTIONS);
            reset();
            setShowDetalle(false);
            refresh();
            options.closeCustomModal();
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

    const validaDiferencia = difParcial.every(objeto => {
        for (const llave in objeto) {
            if (objeto[llave] !== true) {
                return false;
            }
        }
        return true;
    });

    return (<>
        <div className="text-center mt-2" style={{ fontSize: "12px" }}>
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
                                <option value="">SELECCIONA UNA OPCIÓN</option>
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
                            const diferencia = elemento['No Billetes'] - billetesFisicos[index][getPropiedad('denominacion',elemento)];
                            const iconoDiferencia =
                                diferencia === 0
                                    ? 'bi bi-exclamation-circle-fill text-success'
                                    : diferencia < 5
                                        ? 'bi bi-exclamation-triangle-fill text-warning'
                                        : 'bi bi-exclamation-circle-fill text-danger';

                            /*Hace la diferencia entre el monto actual con el monto*/
                            const diferenciaMonto = (billetesFisicos[index][getPropiedad('denominacion',elemento)] *  elemento.Denominacion) - elemento.Monto; // Calcular la diferencia de montos

                            return (
                                <tr key={elemento.Denominacion}>
                                    <td>{elemento.Denominacion}</td>
                                    <td>
                                        <i className={iconoNoBilletes}></i> {elemento['No Billetes']}
                                    </td>
                                    <td>
                                        {FormatoMoneda(parseFloat(elemento.Monto))}
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
                                            {...register(`${getPropiedad('denominacion',elemento)}`, {
                                                validate: {
                                                    validacionMN: (value) => /^[0-9]\d*$/.test(value) || value === 0,
                                                },
                                            })}
                                            type="text"
                                            name={`${getPropiedad('denominacion',elemento)}`}
                                            className={` text-center form-control ${errors && errors[`${getPropiedad('denominacion',elemento)}`] ? 'is-invalid' : ''}`}
                                            placeholder="$"
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let newValue = /^\d*\.?\d+$/.test(inputValue) ? inputValue: "";
                                                setValue(`${getPropiedad('denominacion',elemento)}`, newValue);
                                                if(newValue === "") {
                                                    newValue = 0;
                                                }
                                                if(parseInt(newValue) >= 0) {
                                                    setDifParcial((prevDifParcial) => {
                                                        // Crear una copia del estado actual
                                                        const updatedDifParcial = [...prevDifParcial];

                                                        // Encontrar el objeto que deseas actualizar
                                                        const index = updatedDifParcial.findIndex((obj) => obj.hasOwnProperty(getPropiedad('denominacion', elemento)));

                                                        if (index !== -1) {
                                                            // Actualizar el objeto existente
                                                            updatedDifParcial[index] = {
                                                                [getPropiedad('denominacion', elemento)]: true,
                                                            };
                                                        }

                                                        return updatedDifParcial; // Devolver la copia actualizada del estado
                                                    });
                                                }else {
                                                    setDifParcial((prevDifParcial) => {
                                                        // Crear una copia del estado actual
                                                        const updatedDifParcial = [...prevDifParcial];

                                                        // Encontrar el objeto que deseas actualizar
                                                        const index = updatedDifParcial.findIndex((obj) => obj.hasOwnProperty(getPropiedad('denominacion', elemento)));

                                                        if (index !== -1) {
                                                            // Actualizar el objeto existente
                                                            updatedDifParcial[index] = {
                                                                [getPropiedad('denominacion', elemento)]: false,
                                                            };
                                                        }

                                                        return updatedDifParcial; // Devolver la copia actualizada del estado
                                                    });
                                                }

                                                setBilletesFisicos((prevBilletes) => {
                                                    const newBilletes = [...prevBilletes];
                                                    newBilletes[index][getPropiedad('denominacion',elemento)] = parseInt(newValue);
                                                    return newBilletes;
                                                });

                                                const diferencia = elemento['No Billetes'] - newValue;
                                                setValue(`${getPropiedad('diferencia',elemento)}`, diferencia);
                                                const diferenciaMonto = (elemento.Denominacion * newValue)-elemento.Monto;
                                                setValue(`diferenciaMonto_${elemento.Denominacion}`, diferenciaMonto);

                                            }}
                                            //value={billetesFisicos[index][getPropiedad('denominacion',elemento)]}
                                            autoComplete="off"
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
                                            {FormatoMoneda(parseFloat(totalDiferenciaMontos))}
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
                        <button type="button" className="m-2 btn btn-primary" disabled={totalBilletesFisicos === 0 || !validaDiferencia}
                                onClick={onSubmit}>
                              <span className="me-2">
                                GUARDAR
                                <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                              </span>
                        </button>
                    </div>
                    {
                        showDiferencias && (
                            <ModalGenericTool options={optionsModal}>
                                <div className="d-flex justify-content-center mt-2">
                                    <button type="button" className={`btn btn-danger me-2`} onClick={optionsModal.closeModal}>
                                        <i className='bi bi-x-circle me-2'></i>
                                        NO
                                    </button>

                                    <button type="button" className="btn btn-success"
                                            onClick={cierraCajaDiferencias}>
                                        <i className="bi bi-check-circle me-2"></i>
                                        SI,DE ACUERDO
                                    </button>
                                </div>
                            </ModalGenericTool>
                        )
                    }
                </>)
            }
        </div>
            {
                guarda && <ModalLoading options={optionsLoad} />
            }
        </>
    );
};
