import {FormatoMoneda, validarMoneda} from "../../../utils";
import {useDenominacion} from "../../../hook";
import {dataG} from "../../../App";
import {useEffect} from "react";

export const Denominacion = ({type,moneda,options}) => {

    const valores = {type,moneda,options}
    console.log(valores);

    const {
        title,data,denominacionMappings,register,trigger,errors,setValue,calculateTotal,
        validacionColor,calculateGrandTotal} = useDenominacion(valores)

    return (
        <>
            <div className="text-center mt-2">
                <h5 className="p-2 "><strong>{title}</strong></h5>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                            <tr>
                                {(type !== "R" && type !== "SD") && <th className="col-1">Billetes Disponibles</th>}
                                <th className="col-1">Denominación</th>
                                <th className="col-1">Cantidad</th>
                                <th className="col-1">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                                {data?.map((elemento) => {
                                    let name = denominacionMappings[elemento.Denominacion] || elemento.Denominacion;
                                    return (
                                    <tr key={`denominacion_${name}`}>
                                        { (type !== "R" && type !== "SD")  && <td>{elemento['Billetes Disponibles']}</td>}
                                        <td>{elemento.Denominacion}</td>
                                        <td>
                                            <input
                                                {...register(`denominacion_${name}`, {
                                                    validate: {
                                                        validacionMN: (value) => {
                                                            if(dataG.perfil === 'Oficina Sucursal' ){
                                                                return validarMoneda(`denominacion_${name}`, value);
                                                            }else{
                                                                if (type !== 'R'  && parseInt(value) > elemento['Billetes Disponibles']) {
                                                                    setValue(`denominacion_${name}`,0)
                                                                    return "No hay suficientes billetes disponibles.";
                                                                }
                                                                return validarMoneda(`denominacion_${name}`, value);
                                                            }
                                                            }
                                                    }}
                                                    )
                                                }
                                                type="text"
                                                onBlur={() => trigger(`denominacion_${name}`)}
                                                name={`denominacion_${name}`}
                                                className={`form-control ${errors && errors[`denominacion_${name}`] ? 'is-invalid' : ''}`}
                                                placeholder=" - "
                                                disabled={dataG.perfil === 'Cajero' && options.tipo !== 'R' && elemento['Billetes Disponibles'] <=0}
                                                autoComplete="off"
                                            />
                                        </td>
                                        <td>{calculateTotal(elemento)}</td>
                                    </tr>
                                )
                                })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th colSpan={(type !== "R" && type !== "SD")?3:2}>Total</th>
                                <th className={validacionColor()}>{FormatoMoneda(parseFloat(calculateGrandTotal()))}</th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}