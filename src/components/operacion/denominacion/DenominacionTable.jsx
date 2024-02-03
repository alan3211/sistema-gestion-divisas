import { FormatoMoneda } from "../../../utils";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export const DenominacionTable = ({ data = [], monto, moneda,setTotalMonto,setDenominacion,resetea,boveda}) => {

    const getPropiedad = (property, elemento) => {
        let propiedad = "";
        if (elemento.Denominacion === ".05") {
            propiedad = `${property}_p05`;
        } else if (elemento.Denominacion === ".10") {
            propiedad = `${property}_p1`;
        } else if (elemento.Denominacion === ".20") {
            propiedad = `${property}_p2`;
        } else if (elemento.Denominacion === ".50") {
            propiedad = `${property}_p5`;
        } else {
            propiedad = `${property}_${parseInt(elemento.Denominacion)}`;
        }
        return propiedad;
    };

    const [billetesFisicos, setBilletesFisicos] = useState(

        data.map((elemento) => ({
            [getPropiedad("denominacion", elemento)]: (boveda ? parseInt(elemento["Billetes Confirmados"]) || 0 : parseInt(elemento["Recibido"])) || 0
        }))
    );


    const [totalGeneral, setTotalGeneral] = useState(0); // Nuevo estado para el total general

    const {
        register,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        // Recalcula el total general cuando cambia el estado billetesFisicos
        const total = billetesFisicos.reduce(
            (acc, billete, index) => {
                const totalActual = Object.values(billete).reduce(
                    (acc, value) => acc + value,
                    0
                );
                return acc + totalActual * parseFloat(data[index]["Denominacion"]);
            },
            0
        );
        setTotalMonto(total);
        setTotalGeneral(total);
        console.log("DENOMINACIONES TABLE---")
        console.log(billetesFisicos)
        setDenominacion(billetesFisicos)

        if(resetea){
            reset();
        }

    }, [billetesFisicos]);

    return (
        <form className="table-responsive text-center mt-2 custom-scrollbar" style={{maxHeight: "400px", overflowY: "auto"}}>
            <table className="table table-bordered table-hover">
                <thead className="table-dark sticky top-0">
                <tr>
                    <th className="col-1">Denominación ({moneda})</th>
                    <th className="col-1">{boveda ? 'Billetes Solicitados':'Cantidad a Recibir'}</th>
                    <th className="col-1">{boveda ? 'Billetes Confirmados':'Recibido'}</th>
                    <th className="col-1">Total</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((elemento, index) => {
                    let name = elemento.Denominacion;

                    const totalActual = Object.values(billetesFisicos[index]).reduce(
                        (acc, value) => acc + value,
                        0
                    );

                    return (
                        <tr key={`denominacion_${name}`}>
                            <td>{name}</td>
                            <td>{
                                    elemento.hasOwnProperty("Cantidad a Recibir")
                                        ? parseFloat(elemento["Cantidad a Recibir"])
                                        : parseFloat(elemento["Billetes Solicitados"])
                              }
                            </td>
                            <td>
                                <input
                                    {...register(`${getPropiedad("denominacion", elemento)}`, {
                                        validate: {
                                            validacionMN: (value) => /^[0-9]\d*$/.test(value) || value === 0,
                                        },
                                    })}
                                    type="text"
                                    name={`${getPropiedad("denominacion", elemento)}`}
                                    className={` text-center form-control ${
                                        errors && errors[`${getPropiedad("denominacion", elemento)}`]
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    placeholder={billetesFisicos[index][getPropiedad("denominacion", elemento)]}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const newValue = /^[0-9]\d*$/.test(inputValue) ? parseInt(inputValue) : 0;

                                        setBilletesFisicos((prevBilletes) => {
                                            const newBilletes = [...prevBilletes];
                                            newBilletes[index][getPropiedad("denominacion", elemento)] = newValue;
                                            return newBilletes;
                                        });
                                    }}
                                    autoComplete="off"
                                />
                            </td>
                            <td>{totalActual * elemento.Denominacion}</td>
                        </tr>
                    );
                })}
                </tbody>
                <tfoot className="sticky bottom-0">
                <tr>
                    <td colSpan={3}>
                        <strong>Total</strong>
                    </td>
                    <td className={parseFloat(totalGeneral) === parseFloat(monto) ? 'text-success':'text-danger'}>
                        <strong>{FormatoMoneda(parseFloat(totalGeneral))}</strong>
                    </td>
                </tr>
                </tfoot>
            </table>
        </form>
    );
};
