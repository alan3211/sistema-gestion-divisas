import {InputComponent} from "../../commons/inputs/InputComponent";
import {TableComponent} from "../../commons/tables/TableComponent";
import {ToastComponent} from "../../commons/toast/ToastComponent";
import {ClienteCoincidenciaComponent} from "../busquedaClientes/ClienteCoincidenciaComponent";

export const AltaClienteFormComponent = ({propForm}) => {

    const options = [
        { nombre: "Nombre(s)",name:"nombre",tipo:"text",texto:"Ingresa el nombre del cliente",estilo:"col-md-3"},
        { nombre: "Apellido Paterno",name:"apellido_paterno",tipo:"text",texto:"Ingresa el apellido paterno",estilo:"col-md-3"},
        { nombre: "Apellido Materno",name:"apellido_materno",tipo:"text",texto:"Ingresa el apellido materno",estilo:"col-md-3"},
        { nombre: "Fecha Nacimiento",name:"fecha_nacimiento",tipo:"date",texto:"",estilo:"col-md-3"},
        { nombre: "Tipo Identificación",name:"tipo_identificacion",tipo:"select",texto:"Tipo Identificación",estilo:"col-md-3",id_catalogo:2},
        { nombre: "Número de Identificación",name:"numero_identificacion",tipo:"text",texto:"Número Identificación",estilo:"col-md-3"},
        { nombre: "Siguiente",tipo:"button",estiloBtn:"m-2 btn btn-primary d-grid gap-2",estilo:"col-md-2", fn: propForm.handleValidateForm,isLoading:propForm.isloading,icon:'spinner-border spinner-border-sm'},
    ];

    const nuevoCliente = () => {
        propForm.setComplementarios(true);
        propForm.setMessageActive(false);
    }

    return (
        <>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">
                    <i className="ri-user-add-fill p-2"></i>
                    <strong>Alta de Clientes</strong>
                </h5>
                <form className="row g-3 needs-validation was-validated" noValidate>
                    {
                       options.map((elemento) => {
                            return (
                            <>
                                <InputComponent
                                    {...elemento}
                                    key={elemento.name}
                                    onInputChange={propForm.handleInputChange}
                                />
                                {propForm.errors[elemento.name] && <div className="invalid-feedback">{propForm.errors[elemento.name]}</div>}
                            </>);
                       })
                    }

                    <div className="col-md-4">
                        <div className="form-floating">
                            {
                                propForm.messageActive && <ToastComponent type="info" title="El cliente que intenta dar de alta ya se encuentra en la base de datos. A continuación, se muestran los siguientes clientes con coincidencias."/>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
        {
            propForm.messageActive &&
            <ClienteCoincidenciaComponent
                dataClientes={propForm.dataClientes}
                tools={{selecciona:true}}
                showAddCliente
                addCliente={nuevoCliente}
                setDataCliente={propForm.setDataCliente}
            />
        }
    </>
    );
}