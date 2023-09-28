import {CompraVentaContext} from "./CompraVentaContext";
import {useForm} from "react-hook-form";
import {useState} from "react";

export const CompraVentaProvider = ({children}) => {

    const {register,handleSubmit,formState:{errors},reset,watch} = useForm();

    const [cantidad, setCantidad] = useState('');
    const [showCantidadEntregada, setShowCantidadEntregada] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [continuaOperacion,setContinuaOperacion] = useState(false);
    const [operacion,setOperacion] = useState({});
    const [tipoDivisa,setTipoDivisa] =  useState([]);

    /*Provedor para la Busqueda del cliente*/
    const [selectedOption, setSelectedOption] = useState("cliente");

    const formBuscarCliente = useForm();
    const [showCliente, setShowCliente] = useState(false);
    const [data, setData] = useState({
        headers:[],
        result_set:[],
        total_rows:0
    });

    const [datos,setDatos] = useState({});
    const busquedaCliente = {
        selectedOption,
        setSelectedOption,
        showCliente,
        setShowCliente,
        formBuscarCliente,
        data,
        setData,
    }

    const [cliente,setCliente]  = useState('');

    const compraVentaProvider = {
        cantidad,
        setCantidad,
        showCantidadEntregada,
        setShowCantidadEntregada,
        showModal,
        setShowModal,
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
        busquedaCliente,
        cliente,
        setCliente,
        datos,
        setDatos,
    }

    return(
        <CompraVentaContext.Provider value={compraVentaProvider}>
            {children}
        </CompraVentaContext.Provider>
    )
}