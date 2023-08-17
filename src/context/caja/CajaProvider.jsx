import {CajaContext} from "./CajaContext";
import {useState} from "react";
import {useForm} from "react-hook-form";

export const CajaProvider = ({children}) =>{

    /*Seccion de la dotacion*/
    const [showDenominacion,setShowDenominacion] =  useState(false);
    const [isOkRecibido,setIsOkRecibido] = useState(true);
    const dotacionForm = useForm();

    const dotacion = {
        showDenominacion,
        setShowDenominacion,
        isOkRecibido,
        setIsOkRecibido,
        dotacionForm
    }


    const cajaProvider = {
        dotacion
    }

    return (
      <CajaContext.Provider value={cajaProvider}>
          {children}
      </CajaContext.Provider>
    );
}