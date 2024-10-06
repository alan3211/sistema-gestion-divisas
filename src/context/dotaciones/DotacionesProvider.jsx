import {DotacionesContext} from "./DotacionesContext";
import {useState} from "react";

export const DotacionesProvider = ({children}) => {

    const [montoSolicitado,setMontoSolicitado] = useState([]);

    const addMonto = (nuevoMonto) => {
        // Verificar si el monto ya existe en el array
        const existeMonto = montoSolicitado.find(
            (monto) =>
                monto.Id === nuevoMonto.Id &&
                monto.Boveda === nuevoMonto.Boveda
        );

        if (existeMonto) {
            // Si el monto ya existe, actualizar su valor
            setMontoSolicitado((prevMontos) =>
                prevMontos.map((monto) =>
                    monto.Id === nuevoMonto.Id && monto.Boveda === nuevoMonto.Boveda
                        ? { ...monto, Monto: nuevoMonto.Monto }
                        : monto
                )
            );
        } else {
            // Si el monto no existe, agregarlo al array
            setMontoSolicitado((prevMontos) => [...prevMontos, nuevoMonto]);
        }
    };

    const cleanMontos = () => setMontoSolicitado([]);

    const dotaciones = {
        addMonto,
        montoSolicitado,
        cleanMontos
    }


    return(
        <DotacionesContext.Provider value={dotaciones}>
            {children}
        </DotacionesContext.Provider>
    )
}