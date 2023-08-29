import {DenominacionContext} from "./DenominacionContext";
import {useForm} from "react-hook-form";
import {useState} from "react";

export const DenominacionProvider = ({children}) => {

    const denominacionE = useForm();
    const denominacionR = useForm();
    const denominacionC = useForm();
    const denominacionD = useForm();

    const proveedorDenominacion = {
        denominacionE,
        denominacionR,
        denominacionC,
        denominacionD,
    }

    return(
        <DenominacionContext.Provider value={proveedorDenominacion}>
            {children}
        </DenominacionContext.Provider>
    )
}