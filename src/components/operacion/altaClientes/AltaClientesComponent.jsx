import {useState} from "react";
import {AltaClienteFormComponent} from "./AltaClienteFormComponent";
import {AltaClienteComplementario} from "./AltaClienteComplementario";
import {validateInput} from "../../../utils/validators";
import {validaCliente} from "../../../services/operaciones-services";
import {useForm} from "../../../hook/useForm";

export const AltaClientesComponent = () => {

    const [complementarios,setComplementarios] = useState(false);


    const {formValues, handleInputChange} = useForm({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        tipo_identificacion: 0,
        numero_identificacion: ''
    });
    const [messageActive,setMessageActive] =  useState(false);
    const [isloading,setIsloading] = useState(false);
    const [errors, setErrors] = useState({});
    const [dataClientes, setDataClientes ] = useState([]);

    const handleValidateForm = async () => {

        const newErrors = validateInput(formValues);
        console.log(newErrors);
        setErrors(newErrors);

        setIsloading(true);
        setMessageActive(false);

        if (Object.keys(newErrors).length === 0) {
            const dataClientes = await validaCliente(formValues);
            console.log("Valor Cliente: ",dataClientes)
            if('estatus' in dataClientes){
                setIsloading(false)
                setComplementarios(true);
            } else{
                setDataClientes(dataClientes);
                setIsloading(false)
                setMessageActive(true);
            }
        }
    }

    const propForm = {
        setComplementarios: setComplementarios,
        setIsloading:setIsloading,
        setMessageActive:setMessageActive,
        formValues:formValues,
        isloading: isloading,
        errors: errors,
        setErrors: setErrors,
        messageActive: messageActive,
        dataClientes: dataClientes,
        setDataClientes,
        handleValidateForm:handleValidateForm,
        handleInputChange:handleInputChange,
    }

    return(
        <main id="main" className="h-100">
            <div className="pagetitle">
                <h1>Operación</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">Operación</li>
                        <li className="breadcrumb-item active">Alta de Clientes</li>
                    </ol>
                </nav>
            </div>

            <section className="section">
                <AltaClienteFormComponent propForm={propForm} />
                {
                   complementarios && <AltaClienteComplementario propForm={propForm} />
                }
            </section>
        </main>
    );
}