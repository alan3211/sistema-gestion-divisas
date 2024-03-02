import {AltaClienteContext} from "./AltaClienteContext";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {AltaClienteFormulario} from "../../schemas/valoresIniciales";

export const AltaClienteProvider = ({children}) => {

    const [complementarios,setComplementarios] = useState(false);
    const [messageActive,setMessageActive] =  useState(false);
    const [isloading,setIsloading] = useState(false);
    const [dataClientes, setDataClientes ] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showCargaDocumentos, setShowCargaDocumentos] = useState(false);

    const {
        register,
        handleSubmit,
        formState:{errors},
        watch,
        reset,
        setValue,
        getValues,
        trigger,
    } = useForm({defaultValues:AltaClienteFormulario});

    const propForm = {
        complementarios,
        setComplementarios,
        setIsloading,
        setMessageActive,
        isloading,
        messageActive,
        dataClientes,
        setDataClientes,
        register,
        handleSubmit,
        errors,
        watch,
        reset,
        setValue,
        getValues,
        trigger,
        showEdit,
        setShowEdit,
        showCargaDocumentos,
        setShowCargaDocumentos,
    }
    return(
        <AltaClienteContext.Provider value={{propForm}}>
            {children}
        </AltaClienteContext.Provider>
    )
}