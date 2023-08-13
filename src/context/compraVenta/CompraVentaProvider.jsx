import {CompraVentaContext} from "./CompraVentaContext";
import {useForm} from "react-hook-form";
import {useState} from "react";

export const CompraVentaProvider = ({children}) => {

    const {register,handleSubmit,formState:{errors},reset,watch} = useForm();

    const [continuaOperacion,setContinuaOperacion] = useState(false);
    const [operacion,setOperacion] = useState({});
    const [tipoDivisa,setTipoDivisa] =  useState([]);

    /*Provedor para la Busqueda del cliente*/
    const [selectedOption, setSelectedOption] = useState("cliente");

    const formBuscarCliente = useForm();
    const [showCliente, setShowCliente] = useState(false);
    const [data, setData] = useState([]);

    const busquedaCliente = {
        selectedOption,
        setSelectedOption,
        showCliente,
        setShowCliente,
        formBuscarCliente,
        data,
        setData,
    }

    const compraVentaProvider = {
        continuaOperacion,
        setContinuaOperacion,
        operacion,
        setOperacion,
        tipoDivisa,
        setTipoDivisa,
        register,
        handleSubmit,
        errors,
        reset,
        watch,
        busquedaCliente
    }

    return(
        <CompraVentaContext.Provider value={compraVentaProvider}>
            {children}
        </CompraVentaContext.Provider>
    )
}