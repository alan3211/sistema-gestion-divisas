import {useEffect, useMemo, useState} from "react";
import {obtieneDenominaciones} from "../../../services";
import {useForm} from "react-hook-form";
import {validarMoneda} from "../../../utils";

export const Denominacion = ({type,moneda,options}) => {

    const opciones = {
        RECIBE: 'R',
        ENTREGA: 'E',
        CAMBIO: 'CH',
        DOTACION: 'D',
        CIERRE: 'C',
        TRASPASO: 'T'
    }
    const {title,importe,calculaValorMonto,habilita,setHabilita} =  options;

    const [data,setData] = useState([]);
    const {register,formState:{errors},handleSubmit,watch,reset} = useForm();

    const watchAllInputs = watch();
    // Función para calcular el total de una denominación
    const calculateTotal = (denominacion) => {
        const cantidad = watchAllInputs[`denominacion_${denominacion}`] || 0.0;
        return cantidad * denominacion;
    };

    // Calcula el total acumulado de todas las denominaciones
    const calculateGrandTotal = () => {
        let grandTotal = 0;
        data?.forEach((elemento) => {
            grandTotal += calculateTotal(elemento.denominacion);
        });
        return grandTotal;
    };


    // Valida solo cuando hace la operacion del cliente y entrega billetes
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const denominacionValue = parseFloat(data[key].denominacion);

            if ((type === 'E' || type === 'CH') && denominacionValue.toPrecision(1) > importe) {
                delete data[key];
            }
        }
    }




    const validacionColor = () => {

        if(type === 'R'){
            if(calculateGrandTotal() === calculaValorMonto){
                return 'text-success';
            } else if (calculateGrandTotal() > calculaValorMonto){
                return 'text-warning';
            }
            else {
                return 'text-danger';
            }
        }else{
            if(calculateGrandTotal() === importe){
                return 'text-success';
            } else {
                return 'text-danger';
            }
        }
    };

    useEffect(() => {
        const newHabilita = { ...habilita };
        let isValid;

        if (type === 'R') {
            isValid = calculateGrandTotal() >= parseFloat(calculaValorMonto);
            newHabilita.recibe = !isValid;
        } else {
            isValid = calculateGrandTotal() === importe;
            newHabilita.entrega = !isValid;
        }
        setHabilita(newHabilita);

    }, [calculateGrandTotal(), type]);



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
                                {data?.map((elemento) => (
                                    <tr key={`denominacion_${elemento.denominacion}`}>
                                        <td>{elemento.denominacion}</td>
                                        <td>
                                            <input
                                                {...register(`denominacion_${elemento.denominacion}`, {
                                                    validate: {
                                                        validacionMN: (value) => validarMoneda(`denominacion_${elemento.denominacion}`,value),
                                                        mayorACero: value => parseFloat(value) > 0 || "La denominación debe ser mayor a 0.",
                                                    }
                                                })}
                                                type="text"
                                                name={`denominacion_${elemento.denominacion}`}
                                                className={`form-control form-control-sm ${errors && errors[`denominacion_${elemento.denominacion}`] ? 'is-invalid' : ''}`}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td>{calculateTotal(elemento.denominacion)}</td>
                                    </tr>
                                ))}
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