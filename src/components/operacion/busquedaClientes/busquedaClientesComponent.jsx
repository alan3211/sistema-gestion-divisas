import {TitleComponent} from "../../commons/TitleComponent";
import {useState} from "react";
import {InputComponent} from "../../commons/inputs/InputComponent";

import './busquedaClientes.css';
import {FormCliente} from "./FormCliente";
import {buscaCliente} from "../../../services/operaciones-services";
import {useForm} from "../../../hook/useForm";
import {ClienteCoincidenciaComponent} from "./ClienteCoincidenciaComponent";
import {DatosClientes} from "./DatosClientes";

export const BusquedaClientesComponent = ({operacion,cliente}) => {

    const [showControl, setShowControl] = useState({
        busquedaCliente: 'cliente'
    });

    const [showCliente, setShowCliente] = useState(false);

    const [isloading,setIsloading] = useState(false);
    const [data,setData] = useState([]);


    const {formValues,handleInputChange} = useForm({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        cliente:'',
    });

    const handleValidateForm = async () => {
        console.log(formValues)
        formValues.tipo_busqueda = showControl.busquedaCliente === 'cliente' ? 1:2
        const dataClientes = await buscaCliente(formValues);
        console.log("Valor Cliente: ",dataClientes)
        setShowCliente(true)
        setData(dataClientes);
        //resetForm();
    }


    const optionsBusquedaCliente = [
        { nombre: "Número de Cliente",name:"cliente",tipo:"radio",estilo:"col-md-4",seleccionado:{showControl,setShowControl,setShowCliente}},
        { nombre: "Nombre", name: "nombre", tipo: "radio", estilo: "col-md-4", seleccionado:{showControl,setShowControl,setShowCliente} },
    ];

    const optionsFormCliente = [
        { nombre: "Número de Cliente",name:"cliente",tipo:"text",texto:"Número de Cliente",estilo:"col-md-4"},
        { nombre: "Buscar",tipo:"button",estiloBtn:"m-2 btn btn-primary d-grid gap-2",estilo:"col-md-2", fn: handleValidateForm,isLoading:isloading,icon:'spinner-border spinner-border-sm'},
    ];

    const optionsFormClienteNombre = [
        { nombre: "Nombre(s)",name:"nombre",tipo:"text",texto:"Ingresa el nombre del cliente",estilo:"col-md-3"},
        { nombre: "Apellido Paterno",name:"apellido_paterno",tipo:"text",texto:"Ingresa el apellido paterno",estilo:"col-md-3"},
        { nombre: "Apellido Materno",name:"apellido_materno",tipo:"text",texto:"Ingresa el apellido materno",estilo:"col-md-3"},
        { nombre: "Fecha Nacimiento",name:"fecha_nacimiento",tipo:"date",texto:"",estilo:"col-md-3"},
        { nombre: "Buscar",tipo:"button",estiloBtn:"m-2 btn btn-primary d-grid gap-2",estilo:"col-md-2", fn: handleValidateForm,isLoading:isloading,icon:'spinner-border spinner-border-sm'},
    ];

    return (
        <>
            <div className="card shadow">
                <div className="card-body">
                    <TitleComponent title="Búsqueda de Clientes" icon="ri-user-fill" />
                    <div className="search-options">
                        <h6 className="card-title"><i className="bi bi-search m-2"></i> Buscar por:</h6>
                        <div className="radio-options m-2">
                            {optionsBusquedaCliente.map((elemento) => (
                                <InputComponent {...elemento} key={elemento.name} />
                            ))}
                        </div>
                    </div>
                    {
                        showControl.busquedaCliente === 'cliente'
                        ? <FormCliente handleInputChange={handleInputChange} options={optionsFormCliente}/>
                        : <FormCliente handleInputChange={handleInputChange} options={optionsFormClienteNombre}/>
                    }
                </div>
            </div>
            {
                (data.length > 1) &&
                <ClienteCoincidenciaComponent
                    dataClientes={data}
                    tools={{selecciona:true}}
                    setShowCliente={setShowCliente}
                    setData={setData}
                />
            }
            {
                showCliente && <DatosClientes operacion={operacion} cliente={data[0] || data} />
            }
        </>
    );
}