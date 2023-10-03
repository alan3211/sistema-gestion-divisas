import {useContext, useEffect, useState} from "react";
import {obtieneDenominaciones} from "../../../services";
import {validarMoneda} from "../../../utils";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {useDenominacion} from "../../../hook/useDenominacion";
import {dataG} from "../../../App";

export const Denominacion = ({type,moneda,options}) => {

    const valores = {type,moneda,options}

    const {
        title,data,denominacionMappings,register,trigger,errors,calculateTotal,
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
                                <th className="col-1">Billetes Disponibles</th>
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
                                        <td>{elemento['Billetes Disponibles']}</td>
                                        <td>{elemento.Denominacion}</td>
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
                                                disabled={dataG.perfil === 'Cajero' && options.tipo !== 'R' && elemento['Billetes Disponibles'] <=0}
                                            />
                                        </td>
                                        <td>{calculateTotal(elemento.Denominacion)}</td>
                                    </tr>
                                )
                                })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th colSpan="3">Total</th>
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