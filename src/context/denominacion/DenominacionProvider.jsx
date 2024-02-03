import {DenominacionContext} from "./DenominacionContext";
import {useForm} from "react-hook-form";

export const DenominacionProvider = ({children}) => {

    const denominacionE = useForm(); // Para Entrega de divisas
    const denominacionR = useForm(); // Para Recibir divisas de usuario
    const denominacionC = useForm(); // Para dar Cambio al usuario
    const denominacionD = useForm(); // Para dar dotaciones a sucursal
    const denominacionB = useForm(); // Para Boveda

    const proveedorDenominacion = {
        denominacionE,
        denominacionR,
        denominacionC,
        denominacionD,
        denominacionB,
    }

    return(
        <DenominacionContext.Provider value={proveedorDenominacion}>
            {children}
        </DenominacionContext.Provider>
    )
}