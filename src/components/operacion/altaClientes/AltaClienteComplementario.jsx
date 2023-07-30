import {InputComponent} from "../../commons/inputs/InputComponent";
import {validateInput} from "../../../utils/validators";
import {useState} from "react";
import {guardaCliente} from "../../../services/operaciones-services";
import {dataG} from "../../../App";
import {ModalConfirm} from "../../commons/modals/ModalConfirm";
import {useOperaCliente} from "../../../hook/useOperaCliente";

export const AltaClienteComplementario = ({propForm}) => {

    const [isloading,setIsloading] = useState(false);
    const [dataCliente,setDataCliente] = useState({});

    const {showModal,setShowModal,selectedItem,setSelectedItem,closeModal,hacerOperacion} =  useOperaCliente();


    const handleValidateFinalForm = async () => {
        setIsloading(true);

        const newErrors = validateInput(propForm.formValues);
        propForm.setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            propForm.formValues = {
                ...propForm.formValues,
                sucursal: dataG.sucursal
            }
            const dataClientes = await guardaCliente(propForm.formValues);
            console.log(dataClientes)
            if(dataClientes){
                setDataCliente(dataClientes);
                setIsloading(false);
                setShowModal(true);
                setSelectedItem(dataCliente.cliente);
            }

        }
    }

    const opcionesComplementarias = [
        { nombre: "Teléfono",name:"telefono",tipo:"text",texto:"Ingresa el teléfono",estilo:"col-md-3"},
        { nombre: "Actividad Económica",name:"id_actividad_economica",tipo:"select",texto:"Actividad Económica",estilo:"col-md-3",id_catalogo:1},
        { nombre: "Nacionalidad",name:"nacionalidad",tipo:"select",texto:"Nacionalidad",estilo:"col-md-3",id_catalogo:3},
        { nombre: "País Nacimiento",name:"pais_nacimiento",tipo:"select",texto:"País Nacimiento",estilo:"col-md-3",id_catalogo:3},
        { nombre: "Calle",name:"calle",tipo:"text",texto:"Ingresa la calle",estilo:"col-md-3"},
        { nombre: "Número Exterior",name:"numero_exterior",tipo:"text",texto:"Ingresa el Número Exterior",estilo:"col-md-3"},
        { nombre: "Número Interior",name:"numero_interior",tipo:"text",texto:"Ingresa el Número Interior",estilo:"col-md-3"},
        { nombre: "Código Postal",name:"codigo_postal",tipo:"select",texto:"Código Postal",estilo:"col-md-3",id_catalogo:5},
        { nombre: "Estado",name:"estado",tipo:"select",texto:"Estado",estilo:"col-md-4",id_catalogo:6},
        { nombre: "Municipio",name:"municipio",tipo:"select",texto:"Ingresa el municipio",estilo:"col-md-4",id_catalogo:7},
        { nombre: "Colonia",name:"colonia",tipo:"select",texto:"Ingresa la colonia",estilo:"col-md-4",id_catalogo:8},
    ];

    const opcionesPerfilTransaccional = [
        { nombre: "Monto",name:"monto",tipo:"select",texto:"Monto",estilo:"col-md-4",id_catalogo:12},
        { nombre: "Frecuencia",name:"frecuencia",tipo:"select",texto:"frecuencia",estilo:"col-md-4",id_catalogo:13},
        { nombre: "# Operaciones",name:"numero_operaciones",tipo:"select",texto:"número operaciones",estilo:"col-md-4",id_catalogo:14},
        { nombre: "Origen Recursos",name:"origen_recursos",tipo:"select",texto:"origen recursos",estilo:"col-md-4",id_catalogo:10},
        { nombre: "Destino Recursos",name:"destino_recursos",tipo:"select",texto:"destino recursos",estilo:"col-md-4",id_catalogo:11},
        { nombre: "Finalizar",tipo:"button",estiloBtn:"m-2 btn btn-primary d-grid gap-2",estilo:"col-md-4 text-center", fn: handleValidateFinalForm,isLoading:isloading,icon:'spinner-border spinner-border-sm'},
    ];

    return (
        <>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">
                    <i className="ri-file-list-2-fill p-2"></i>
                    <strong>Datos Complementarios</strong>
                </h5>
                <form className="row g-3 needs-validation was-validated" noValidate>
                    {
                        opcionesComplementarias.map((elemento) => {
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
                </form>
            </div>
        </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        <i className="bi bi-file-person-fill p-2"></i>
                        <strong>Perfil Transaccional</strong>
                    </h5>
                    <form className="row g-3 needs-validation was-validated" noValidate>
                        {
                            opcionesPerfilTransaccional.map((elemento) => {
                                return (
                                    <>
                                        <InputComponent  {...elemento}
                                                         key={elemento.name}
                                                         onInputChange={propForm.handleInputChange}
                                        />
                                        {propForm.errors[elemento.name] && <div className="invalid-feedback">{propForm.errors[elemento.name]}</div>}
                                    </>);
                            })

                        }

                    </form>
                </div>
            </div>

            <ModalConfirm
                showModal={showModal}
                closeModal={closeModal}
                selectedItem={selectedItem}
                hacerOperacion={hacerOperacion}
                title={`El registro se ha completado satisfactoriamente con el número de cliente:  ${dataCliente.cliente}`}
            />


        </>
    );
}