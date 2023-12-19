import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {
    DENOMINACIONES,
    encryptRequest, FormatoMoneda,
    formattedDateWS,
    getDenominacion,
    getDiferenciaDenominacion,
    obtenerArrayDifDenominaciones,
    obtenerObjetoDenominaciones,
    opciones,
} from "../../../utils";
import {dataG} from "../../../App";
import {toast} from "react-toastify";
import {entregaCaja} from "../../../services/operacion-caja";
import {ModalLoading} from "../../commons/modals/ModalLoading";


export const ResumenCajaParcial = ({data, moneda, setShowDetalle, refresh, resetForm}) => {

    const [guarda,setGuarda] = useState(false);
    const getPropiedad = (property, elemento) => {
        let propiedad = '';
        if (elemento.Denominacion === '0.05') {
            propiedad = `${property}_p05`;
        } else if (elemento.Denominacion === '0.10') {
            propiedad = `${property}_p1`;
        } else if (elemento.Denominacion === '0.20') {
            propiedad = `${property}_p2`;
        } else if (elemento.Denominacion === '0.50') {
            propiedad = `${property}_p5`;
        } else {
            propiedad = `${property}_${parseInt(elemento.Denominacion)}`;
        }
        return propiedad;
    }

    // Inicializa billetesFisicos
    const billetesFisicosInicial = data.result_set.map((elemento) => {
        return {
            [getPropiedad('denominacion', elemento)]: parseInt(elemento['Billetes Físicos']) || 0
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

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        reset
    } = useForm();
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
            const diferencia = elemento['No Billetes'] - billetesFisicos[index][getPropiedad('denominacion', elemento)];
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

        console.log("Total Diferencias: ", totalDif);

        //Calcula el total de diferencia de monto
        const totalDifMontos = data.result_set.reduce((total, elemento, index) => {
            const newValue = billetesFisicos[index][getPropiedad('denominacion', elemento)];
            const diferenciaMonto = (elemento.Denominacion * newValue) - elemento.Monto;
            return total + diferenciaMonto;
        }, 0);

        console.log("Total Diferencias Montos: ", totalDifMontos);

        setTotalDiferenciaMontos(totalDifMontos);

    }, [billetesFisicos]);

    const optionsLoad = {
        showModal:guarda,
        closeCustomModal: ()=> setGuarda(false),
        title:'Guardando...'
    }

    const onSubmit = handleSubmit(async (datos) => {
        const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
        const horaOperacion = horaDelDia.split(":").join("");

        const cierreCaja = {
            noCliente: '',
            ticket_notaCredito: '',
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
            moneda: moneda,
            traspaso: '',
            diferencias: 0,
        }

        cierreCaja.ticket = `CIERREPARCIAL${dataG.sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;

        const formValuesD = getDenominacion(cierreCaja.moneda, datos)
        const formValuesDif = getDiferenciaDenominacion(cierreCaja.moneda, datos)

        const denominaciones = obtenerObjetoDenominaciones(formValuesD);
        denominaciones.divisa = cierreCaja.moneda;
        denominaciones.tipoOperacion = '0';
        denominaciones.movimiento = 'CIERRE PARCIAL';
        cierreCaja.diferencia = obtenerArrayDifDenominaciones(formValuesDif);
        cierreCaja.denominacion = [
            denominaciones,
        ]

        cierreCaja.totalDiferenciaMonto = totalDiferenciaMontos;
        cierreCaja.totalDiferenciaBilletes = totalDiferencia;


            const encryptedData = encryptRequest(cierreCaja);
            setGuarda(true)
            const response = await entregaCaja(encryptedData);

            if (response !== '') {
                setGuarda(false)
                toast.success('Se ha realizado el cierre parcial', {
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
        console.warn("Cierre Parcial CAJA", cierreCaja)
    });

    const validaDiferencia = difParcial.every(objeto => {
        for (const llave in objeto) {
            if (objeto[llave] !== true) {
                return false;
            }
        }
        return true;
    });

    return (
        <>
         <div className="text-center mt-2" style={{fontSize: "12px"}}>

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
                    const diferencia = elemento['No Billetes'] - billetesFisicos[index][getPropiedad('denominacion', elemento)];
                    const iconoDiferencia =
                        diferencia === 0
                            ? 'bi bi-exclamation-circle-fill text-success'
                            : diferencia < 5
                                ? 'bi bi-exclamation-triangle-fill text-warning'
                                : 'bi bi-exclamation-circle-fill text-danger';

                    /*Hace la diferencia entre el monto actual con el monto*/
                    const diferenciaMonto = (billetesFisicos[index][getPropiedad('denominacion', elemento)] * elemento.Denominacion) - elemento.Monto; // Calcular la diferencia de montos

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
                                    {...register(`${getPropiedad('denominacion', elemento)}`, {
                                        validate: {
                                            validacionMN: (value) => /^[0-9]\d*$/.test(value) || value === 0,
                                        },
                                    })}
                                    type="text"
                                    name={`${getPropiedad('denominacion', elemento)}`}
                                    className={` text-center form-control ${errors && errors[`${getPropiedad('denominacion', elemento)}`] ? 'is-invalid' : ''}`}
                                    placeholder="$"
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const newValue = /^[0-9]\d*$/.test(inputValue) ? inputValue : 0;
                                        console.log("VALOR: ",parseInt(newValue))
                                        console.log("NO BILLETES: ",parseInt(elemento['No Billetes']))
                                        console.log("COMPARACION: ",parseInt(newValue) < parseInt(elemento['No Billetes']))
                                        if( parseInt(newValue) > parseInt(elemento['No Billetes'])) {
                                            setBilletesFisicos((prevBilletes) => {
                                                const newBilletes = [...prevBilletes];
                                                newBilletes[index][getPropiedad('denominacion', elemento)] = parseInt(newValue);
                                                return newBilletes;
                                            });
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

                                            errors[`${getPropiedad('denominacion', elemento)}`] = {
                                                type: 'manual',
                                                message: 'No cuentas con esa cantidad de billetes.'
                                            }
                                        }else {
                                            delete errors[`${getPropiedad('denominacion', elemento)}`];
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

                                            setBilletesFisicos((prevBilletes) => {
                                                const newBilletes = [...prevBilletes];
                                                newBilletes[index][getPropiedad('denominacion', elemento)] = parseInt(newValue);
                                                return newBilletes;
                                            });
                                            console.log("BILLETS FIS: ", billetesFisicos)
                                            const diferencia = elemento['No Billetes'] - newValue;
                                            setValue(`${getPropiedad('diferencia', elemento)}`, diferencia);
                                            const diferenciaMonto = (elemento.Denominacion * newValue) - elemento.Monto;
                                            setValue(`diferenciaMonto_${elemento.Denominacion}`, diferenciaMonto);
                                        }
                                    }}
                                    value={billetesFisicos[index][getPropiedad('denominacion', elemento)]}
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
                <button type="button" className="m-2 btn btn-primary" disabled={(totales[1] < totalBilletesFisicos) || !validaDiferencia}
                        onClick={onSubmit}>
                              <span className="me-2">
                                GUARDAR
                                <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                              </span>
                </button>
            </div>
        </div>
        {
            guarda && <ModalLoading options={optionsLoad} />
        }
        </>
    );
};
