import {useState} from "react";
import {CargaTipoCambioContext} from "./CargaTipoCambioContext";
import {useForm} from "../../hook";

export const CargaTipoCambioProvider = ({children}) => {

    const [tipo,setTipo] = useState('');
    const {formValues,handleInputChange} = useForm({
        sucursal: '',
        region: '',
        opcion: 0,
        usuario:'',
        tipoCambio:[]
    });

    return(
        <CargaTipoCambioContext.Provider value={{tipo,setTipo,formValues,handleInputChange}}>
            {children}
        </CargaTipoCambioContext.Provider>
    )
}