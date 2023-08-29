import {CajaContext} from "./CajaContext";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useForm as useFormulario} from "../../hook/";

export const CajaProvider = ({children}) =>{

    /*Seccion de la dotacion*/
    const [showDenominacion,setShowDenominacion] =  useState(false);
    const [isOkRecibido,setIsOkRecibido] = useState(true);
    const dotacionForm = useForm({defaultValues:{
            moneda:'0'
        }});
    const {formValues,setFormValues,handleInputChange} = useFormulario();

    const dotacion = {
        showDenominacion,
        setShowDenominacion,
        isOkRecibido,
        setIsOkRecibido,
        dotacionForm,
        formValues,
        setFormValues,
        handleInputChange
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