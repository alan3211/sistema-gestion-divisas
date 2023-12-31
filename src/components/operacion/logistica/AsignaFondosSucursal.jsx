import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {encryptRequest, FormatoMoneda, formattedDateWS, nextFocus, opciones, OPTIONS} from "../../../utils";
import {ModalLoading} from "../../commons/modals/ModalLoading";
import {dataG} from "../../../App";
import {enviaDotacionSucursal} from "../../../services/operacion-logistica";
import {toast} from "react-toastify";

const denominacionesMXN = ["0.05", "0.10", "0.20", "0.50", "1", "2", "5", "10", "20", "50", "100", "200", "500", "1000"];
const denominacionesOtras = ["1", "2", "5", "10", "20", "50", "100"];
const InputBilletes = ({ register, denominacion, nombre, rowIndex, handleInputChange }) => {
    return (
        <td nowrap={true} className="">
            <input
                {...register(nombre)}
                type="text"
                name={nombre}
                id={nombre}
                className="form-control-custom"
                placeholder="$"
                onChange={(e) => handleInputChange(e, rowIndex, nombre, denominacion)}
                autoComplete="off"
                //value={billetesFisicos[rowIndex][nombre] || ""}
            />
        </td>
    );
};


export const AsignaFondosSucursal = ({data, moneda,cantidadDisponible,refreshData}) => {
    const [guarda, setGuarda] = useState(false);
    const [dataSuc, setDataSuc] = useState([]);
    const {register, handleSubmit,watch,reset} = useForm();
    const getPropiedad = (denominacion, sucursal) => {
        let propiedad = "";
        if (denominacion === "0.05") {
            propiedad = `v${sucursal}_denominacion_p05`;
        } else if (denominacion === "0.10") {
            propiedad = `v${sucursal}_denominacion_p1`;
        } else if (denominacion === "0.20") {
            propiedad = `v${sucursal}_denominacion_p2`;
        } else if (denominacion === "0.50") {
            propiedad = `v${sucursal}_denominacion_p5`;
        } else {
            propiedad = `v${sucursal}_denominacion_${denominacion}`;
        }

        return propiedad;
    };

    const getOriginalProperty = (denominacion) => {
        let propiedad = "";
        if (denominacion === "p05") {
            propiedad = `0.05`;
        } else if (denominacion === "p1") {
            propiedad = `0.10`;
        } else if (denominacion === "p2") {
            propiedad = `0.20`;
        } else if (denominacion === "p5") {
            propiedad = `0.50`;
        } else {
            propiedad = `${denominacion}`;
        }

        return propiedad;
    }

    // Inicializa billetesFisicos con valores predeterminados
    const initialBilletesFisicos = data.result_set?.map((elemento) => {
        const initialValues = {};

        if (moneda === "MXP") {
            denominacionesMXN.forEach((denominacion) => {
                initialValues[getPropiedad(denominacion, elemento.Sucursal)] = 0;
            });
        } else {
            denominacionesOtras.forEach((denominacion) => {
                initialValues[getPropiedad(denominacion, elemento.Sucursal)] = 0;
            });
        }
        return initialValues;
    }) || [];

    const [billetesFisicos, setBilletesFisicos] = useState(initialBilletesFisicos);
    const [totalBilletes, setTotalBilletes] = useState([]);
    const [totalMonto, setTotalMonto] = useState([0]);
    const [validaGuarda, setValidaGuarda] = useState(true);

    const obtenerSumaPorFila = (billetesFisicos) => {
        return billetesFisicos.map((fila) => {
            return Object.values(fila).reduce((acc, valor) => acc + valor, 0);
        });
    };

    const obtenerMontoTotalPorFila = (billetesFisicos, denominaciones) => {
        return billetesFisicos.map((fila) => {
            const montoTotal = denominaciones.reduce((acc, denominacion) => {

                let prop = "";
                if (denominacion === "0.05") {
                    prop = `denominacion_p05`;
                } else if (denominacion === "0.10") {
                    prop = `denominacion_p1`;
                } else if (denominacion === "0.20") {
                    prop = `denominacion_p2`;
                } else if (denominacion === "0.50") {
                    prop = `denominacion_p5`;
                } else {
                    prop = `denominacion_${denominacion}`;
                }
                const propiedad = Object.keys(fila).find((key) => key.includes(prop));
                const cantidad = propiedad ? fila[propiedad] : 0;
                const monto = parseFloat(cantidad) * parseFloat(denominacion);
                return acc + monto;
            }, 0);

            return montoTotal;
        });
    };


    useEffect(() => {
        // Obtener la suma por fila y actualizar el estado total Billetes
        const sumaPorFila = obtenerSumaPorFila(billetesFisicos);
        setTotalBilletes(sumaPorFila);

        // Obtener el monto total por fila y actualizar el estado totalMonto
        const montoTotalPorFila = obtenerMontoTotalPorFila(billetesFisicos, moneda !== 'MXP' ? denominacionesOtras : denominacionesMXN);
        setTotalMonto(montoTotalPorFila);

        // Validar las diferencias aquí
        const difParcialActualizado = montoTotalPorFila.map((monto, index) => {
            const difValida = monto <= data.result_set[index].Maximo;
            return {[index]: difValida};
        });

        // Validar si todos los elementos en difParcial son true
        const validaGuardaActualizado = difParcialActualizado.every(objeto => {
            for (const llave in objeto) {
                if (objeto[llave] !== true) {
                    return false;
                }
            }
            return true;
        });

        setValidaGuarda(validaGuardaActualizado);
    }, [billetesFisicos]);

    const handleInputChange = (e, rowIndex, nombre, denominacion) => {
        const inputValue = e.target.value;
        const newValue = /^[0-9]\d*$/.test(inputValue) ? parseFloat(inputValue) : 0;

        // Actualizar el estado billetesFisicos
        setBilletesFisicos((prevBilletes) => {
            const newBilletes = prevBilletes.map((fila, index) => {
                if (index === rowIndex) {
                    return {
                        ...fila,
                        [nombre]: newValue,
                    };
                }
                return fila;
            });
            return newBilletes;
        });

        // Obtener la suma por fila y actualizar el estado total Billetes
        const sumaPorFila = obtenerSumaPorFila(billetesFisicos);
        setTotalBilletes(sumaPorFila);


        // Obtener el monto total por fila y actualizar el estado totalMonto
        const montoTotalPorFila = obtenerMontoTotalPorFila(billetesFisicos, moneda !== 'MXP' ? denominacionesOtras : denominacionesMXN);
        setTotalMonto(montoTotalPorFila);

    };

    const iconosEncabezados = {
        Sucursal: "bi bi-hash",
        "Nombre Sucursal": "ri ri-store-3-fill",
        Moneda: "bi bi-cash-coin",
        Minimo: "bi bi-currency-dollar",
        Maximo: "bi bi-currency-dollar",
        "Total Billetes": "bi bi-calculator",
        "Total Monto": "bi bi-calculator",
    };

    const optionsLoad = {
        showModal: guarda,
        closeCustomModal: () => setGuarda(false),
        title: "Guardando...",
    };

    const generarEstructura = (montos, sucursales, elementos) => {
        const estructura = [];

        for (let i = 0; i < sucursales.length; i++) {
            const sucursal = parseInt(sucursales[i]);
            const monto = montos[i];

            if (monto !== 0) {
                const denominacion = [];

                for (const key in elementos) {
                    if (elementos.hasOwnProperty(key)) {
                        const [suc, tipo, valor] = key.split('_');
                        if (tipo === 'denominacion' && suc === `v${sucursal}`) {
                            const nombre = getOriginalProperty(valor);
                            const cantidad = elementos[key] === '' ? 0 : parseInt(elementos[key]);
                            if (cantidad !== 0) {
                                denominacion.push({nombre, cantidad});
                            }
                        }
                    }
                }

                if (denominacion.length > 0) {
                    const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
                    const horaOperacion = horaDelDia.split(":").join("");
                    const ticket = `DOTSUC${sucursal}${dataG.usuario}${formattedDateWS}${horaOperacion}`;

                    const objetoSucursal = {
                        ticket,
                        sucursal: parseInt(sucursal),
                        monto,
                        denominacion,
                    };

                    estructura.push(objetoSucursal);
                }
            }
        }

        return estructura;
    };

    const onSubmit = handleSubmit(async (datos) => {
        setGuarda(true);
        const sucursales = data.result_set.map((elemento) => parseInt(elemento.Sucursal));
        const resultado = generarEstructura(totalMonto, sucursales, datos);
        const valores = {
            opcion: "Dotación Sucursal",
            usuario: dataG.usuario,
            divisa: moneda,
            denominaciones: resultado
        }
        console.log(valores);

        const encryptedData = encryptRequest(valores);

        const response = await enviaDotacionSucursal(encryptedData);

        if (response !== '') {
            toast.success(response, OPTIONS);
            setGuarda(false)
            reset();
            refreshData();
        }

    });

    const validaCantidad = () =>{

        if(parseInt(cantidadDisponible) === 0 || totalMonto.reduce((acc, currentValue) => acc + currentValue,0) === 0){
            return true
        }else if(totalMonto.reduce((acc, currentValue) => acc + currentValue,0) > parseInt(cantidadDisponible)){
            return true
        }else{
            return false;
        }
    }



    return (
        <>
            <div className="text-center mt-2" style={{fontSize: "12px"}}>
                <div className="custom-scrollbar" style={{maxWidth: '100%', overflowX: 'auto'}}>
                    <table className="table table-bordered table-hover custom-scrollbar">
                        <thead className="table-blue">
                        <tr>
                            <th colSpan={5}></th>
                            <th colSpan={moneda === "MXP" ? 14 : 7}>Denominaciones</th>
                            <th colSpan={2}></th>
                        </tr>
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
                            const iconoMinimos = "bi bi-arrow-up text-success";
                            const iconoMaximos = "bi bi-arrow-down text-danger";

                            return (
                                <>
                                    <tr>
                                        <td>{elemento.Sucursal}</td>
                                        <td>{elemento["Nombre Sucursal"]}</td>
                                        <td>{elemento.Moneda}</td>
                                        <td>
                                            <i className={iconoMinimos}></i>
                                            <strong>{FormatoMoneda(parseFloat(elemento.Minimo))}</strong>
                                        </td>
                                        <td>
                                            <i className={iconoMaximos}></i>
                                            <strong>{FormatoMoneda(parseFloat(elemento.Maximo))}</strong>
                                        </td>
                                        {elemento.Moneda === "MXP"
                                            ? denominacionesMXN.map((denominacion) => (
                                                <>
                                                    <InputBilletes
                                                        key={denominacion}
                                                        register={register}
                                                        denominacion={denominacion}
                                                        nombre={getPropiedad(denominacion, elemento.Sucursal)}
                                                        rowIndex={index}
                                                        handleInputChange={handleInputChange}
                                                        billetesFisicos={billetesFisicos}
                                                    />
                                                </>
                                            ))
                                            : denominacionesOtras.map((denominacion) => (
                                                <>
                                                    <InputBilletes
                                                        key={denominacion}
                                                        register={register}
                                                        denominacion={denominacion}
                                                        nombre={getPropiedad(denominacion, elemento.Sucursal)}
                                                        rowIndex={index}
                                                        handleInputChange={handleInputChange}
                                                        billetesFisicos={billetesFisicos}
                                                    />
                                                </>
                                            ))}
                                        <td>{totalBilletes[index]}</td>
                                        <td className={
                                            ((totalMonto[index] === 0 || totalMonto[index] > elemento.Maximo)
                                                ? 'text-danger bold'
                                                : 'text-success bold')
                                        }><i
                                            className={(totalMonto[index] === 0 || totalMonto[index] > elemento.Maximo) ?
                                                'bi bi-exclamation-circle-fill me-1 text-danger'
                                                : 'bi bi-arrow-up-circle-fill me-1 text-success'}></i><strong>{FormatoMoneda(totalMonto[index])}</strong>
                                        </td>
                                    </tr>
                                </>
                            );
                        })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan={moneda === "MXP" ? 20 : 13}>Total</th>
                                <td><strong>{FormatoMoneda(totalMonto.reduce((acc, currentValue) => acc + currentValue,0))}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="col-md-12">
                    <button type="button" className="m-2 btn btn-primary" onClick={onSubmit} disabled={validaCantidad()}>
                        <span className="me-2">
                            GUARDAR
                            <span className="bi bi-save ms-2" role="status" aria-hidden="true"></span>
                        </span>
                    </button>
                </div>
            </div>
            {guarda && <ModalLoading options={optionsLoad}/>}
        </>
    );
};
