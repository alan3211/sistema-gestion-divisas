import {useContext, useEffect, useState} from "react";
import {obtieneDenominaciones} from "../../../services";
import {validarMoneda} from "../../../utils";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";

export const Denominacion = ({type,moneda,options}) => {

    const {
        denominacionR,
        denominacionE,
        denominacionC,
        denominacionD,
    } = useContext(DenominacionContext);

    const {title,importe,calculaValorMonto,habilita,setHabilita} =  options;
    let denominacion = {};

    if(type === 'R'){
        denominacion = denominacionR;
    }else if(type === 'E'){
        denominacion = denominacionE;
    }else if(type === 'C'){
        denominacion = denominacionC;
    }else{
        denominacion = denominacionD;
    }

    const {register,formState:{errors},watch,trigger} = denominacion;
    const watchAllInputs = watch();

    const [data,setData] = useState([]);

    const denominacionMappings = {
        '.10': 'p1',
        '.20': 'p2',
        '.50': 'p5'
    };


    // Función para calcular el total de una denominación parcial
    const calculateTotal = (denominacion) => {
        let name = denominacionMappings[denominacion] || denominacion;
        const cantidad = parseFloat(watchAllInputs[`denominacion_${name}`]) || 0.0;
        const denominacionValue = parseFloat(denominacion);
        return (cantidad * denominacionValue).toFixed(2); // Asegura que el resultado tenga 2 decimales
    };


    // Calcula el total acumulado de todas las denominaciones
    const calculateGrandTotal = () => {
        let grandTotal = 0.0;
        data?.forEach((elemento) => {
            grandTotal += parseFloat(calculateTotal(elemento.denominacion));
        });
        return grandTotal.toFixed(2); // Asegura que el resultado tenga 2 decimales
    };



    // Valida solo cuando hace la operacion del cliente y entrega billetes
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const denominacionValue = parseFloat(data[key].denominacion);
            if ((type === 'E' || type === 'C') && denominacionValue > parseFloat(importe).toFixed(2)) {
                delete data[key];
            }
        }
    }


    const validacionColor = () => {
        const grandTotal = parseFloat(calculateGrandTotal());

        if (type === 'R') {
            if (grandTotal.toFixed(2) === calculaValorMonto) {
                return 'text-success';
            } else if (grandTotal > calculaValorMonto) {
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        } else if (type === 'C') {
            if (grandTotal.toFixed(2) === importe) {
                return 'text-success';
            } else if (grandTotal > importe) {
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        } else {
            if (grandTotal.toFixed(2) === importe) {
                return 'text-success';
            } else {
                return 'text-danger';
            }
        }
    };


    // Me ayuda a validar cuando las cantidades de las monedas se deben de seleccionar.
    useEffect(() => {
        const newHabilita = { ...habilita };
        let isValid;

        if(type === 'C'){
            isValid = calculateGrandTotal() >= parseFloat(importe);
            newHabilita.recibe = !isValid;
        }

        if (type === 'R') {
            isValid = calculateGrandTotal() >= parseFloat(calculaValorMonto);
            newHabilita.recibe = !isValid;
        } else {
            isValid = calculateGrandTotal() === parseFloat(importe).toFixed(2);
            newHabilita.entrega = !isValid;
        }
        setHabilita(newHabilita);
    }, [calculateGrandTotal(), type]);

    // Sirve para cargar la denominacion de la moneda que se envia
    useEffect(() => {
        const fetchData = async () => {
            const denominaciones = await obtieneDenominaciones(moneda);
            setData(denominaciones);
        };
        fetchData();
    },[moneda])


    return (
        <>
            <div className="text-center mt-2">
                <h5 className="p-2 ">{title}</h5>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                            <tr>
                                <th className="col-1">Denominación</th>
                                <th className="col-1">Cantidad</th>
                                <th className="col-1">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                                {data?.map((elemento) => {
                                    let name = denominacionMappings[elemento.denominacion] || elemento.denominacion;
                                    return (
                                    <tr key={`denominacion_${name}`}>
                                        <td>{elemento.denominacion}</td>
                                        <td>
                                            <input
                                                {...register(`denominacion_${name}`, {
                                                    validate: {
                                                        validacionMN: (value) => validarMoneda(`denominacion_${name}`,value),
                                                    }}
                                                    )
                                                }
                                                type="text"
                                                onBlur={() => trigger(`denominacion_${name}`)}
                                                name={`denominacion_${name}`}
                                                className={`form-control ${errors && errors[`denominacion_${name}`] ? 'is-invalid' : ''}`}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td>{calculateTotal(elemento.denominacion)}</td>
                                    </tr>
                                )
                                })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th colSpan="2">Total</th>
                                <th className={validacionColor()}>{calculateGrandTotal()}</th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}