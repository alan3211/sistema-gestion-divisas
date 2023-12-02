import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DotacionesContext } from "../../../../../context/dotaciones/DotacionesContext";

export const MontoSolicitud = ({ item, index, columna }) => {
    const { addMonto, montoSolicitado } = useContext(DotacionesContext);
    const {
        register,
        formState: { errors },
    } = useForm();

    const inputName = `${item.Id}-${item.Boveda}`;
    const [montoLocal, setMontoLocal] = useState("");

    useEffect(() => {
        // Cuando cambia la página, actualiza el estado local con el valor correspondiente
        const montoEnPaginaActual = montoSolicitado.find(
            (monto) => monto.Id === item.Id && monto.Boveda === item.Boveda
        );

        if (montoEnPaginaActual) {
            setMontoLocal(montoEnPaginaActual.Monto);
        } else {
            setMontoLocal("");
        }
    }, [item.Id, item.Boveda, montoSolicitado]);

    const handleChange = (event) => {
        const montoValue = event.target.value;
        setMontoLocal(montoValue);

        const montoObject = {
            Id: item.Id,
            Boveda: item.Boveda,
            Monto: montoValue,
        };
        addMonto(montoObject);
    };

    return (
        <td key={index} className="text-center" style={{ width: "200px" }}>
            <input
                {...register(inputName, {
                    validate: {
                        validacionMN: (value) => /^[1-9]\d*$/.test(value) || value === "0",
                    },
                })}
                type="text"
                name={inputName}
                value={montoLocal}
                className={`text-center form-control ${
                    errors && errors[inputName] ? "is-invalid" : ""
                }`}
                placeholder="$"
                onChange={handleChange}
            />
        </td>
    );
};
