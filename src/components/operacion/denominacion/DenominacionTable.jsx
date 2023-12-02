import {FormatoMoneda} from "../../../utils";
import {useState} from "react";
import {useForm} from "react-hook-form";

export const DenominacionTable = ({data=[],monto,moneda}) => {

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

    const [billetesFisicos, setBilletesFisicos] = useState(
        data.map((elemento) => ({
            [getPropiedad("denominacion", elemento)]: parseInt(elemento["Recibido"]) || 0,
        }))
    );

    const {
        register,
        formState: { errors },
    } = useForm();

    return (
        <div className="table-responsive text-center mt-2">
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th className="col-1">Denominación ({moneda})</th>
                    <th className="col-1">Cantidad a Recibir</th>
                    <th className="col-1">Recibido</th>
                    <th className="col-1">Total</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((elemento, index) => {
                    let name = elemento.Denominacion;

                    // Calcula el total actual sumando los valores de la fila
                    const totalActual = Object.values(billetesFisicos[index]).reduce((acc, value) => acc + value, 0);

                    return (
                        <tr key={`denominacion_${name}`}>
                            <td>{name}</td>
                            <td>{parseInt(elemento["Cantidad a Recibir"])}</td>
                            <td>
                                <input
                                    {...register(`${getPropiedad("denominacion", elemento)}`, {
                                        validate: {
                                            validacionMN: (value) => /^[1-9]\d*$/.test(value) || value === 0,
                                        },
                                    })}
                                    type="text"
                                    name={`${getPropiedad("denominacion", elemento)}`}
                                    className={` text-center form-control ${
                                        errors && errors[`${getPropiedad("denominacion", elemento)}`] ? "is-invalid" : ""
                                    }`}
                                    placeholder="$"
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const newValue = /^[0-9]\d*$/.test(inputValue) ? parseInt(inputValue) : 0;

                                        setBilletesFisicos((prevBilletes) => {
                                            const newBilletes = [...prevBilletes];
                                            newBilletes[index][getPropiedad("denominacion", elemento)] = newValue;
                                            return newBilletes;
                                        });
                                    }}
                                    value={billetesFisicos[index][getPropiedad("denominacion", elemento)]}
                                />
                            </td>
                            <td>{totalActual}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}