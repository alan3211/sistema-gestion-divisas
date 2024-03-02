import {useCatalogo} from "../../../hook";
import {useForm} from "react-hook-form";
import {dataG} from "../../../App";
import {encryptRequest} from "../../../utils";
import {consultaUsuarios} from "../../../services/administracion-services";
import {FilterComboInput} from "../../commons/inputs/FilterComboInput";
import {useState} from "react";
import {TableComponent} from "../../commons/tables";

export const ConsultaUsuarios = () => {

    const catalogo = useCatalogo([17]);
    const propForm = useForm();
    const form = {
          register: propForm.register,
        handleSubmit: propForm.handleSubmit,
        errors: propForm.formState.errors,
        watch: propForm.watch,
        reset: propForm.reset,
        setValue: propForm.setValue,
        trigger: propForm.trigger,
    }

    const [usuariosData,setUsuariosData] = useState([]);
    const [showUsuarios,setShowUsuarios] = useState(false);
    const [formData,setFormData] = useState('');

    const consultarUsuarios = propForm.handleSubmit(async (data) => {
        const encryptedData = encryptRequest(data);
        setFormData(encryptedData)
        const response = await consultaUsuarios(encryptedData);
        setUsuariosData(response);
        setShowUsuarios(true);
        propForm.reset();
    });

    const refresh = async() => {
        const response = await consultaUsuarios(formData);
        setUsuariosData(response);
        setShowUsuarios(true);
        propForm.reset();
    }

    const options = {
        showMostrar:true,
        buscar: true,
        excel:true,
        tableName:'Consulta Usuarios',
        paginacion: true,
        disabledColumns:['ID','Pass'],
        disabledColumnsExcel:['Acciones','ID','Pass'],
        tools:[
            {columna:"Acciones",tool:"acciones-usuarios-sistema",refresh:refresh},
        ],
    }

    return(
        <>
            <form className="row g-3 mt-3" onSubmit={(e)=>e.preventDefault()}>
                <div className="col-md-5 mx-auto">
                    <FilterComboInput
                        propFormulario={form}
                        name="sucursal"
                        label="SUCURSAL"
                        options={catalogo[0] || []}
                    />
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                        <button
                            type="button"
                            className="m-2 btn btn-primary d-grid gap-2"
                            onClick={consultarUsuarios}>
                                <span
                                    className="bi bi-search me-2"
                                    role="status"
                                    aria-hidden="true">
                                    <span className="ms-2">
                                        BUSCAR
                                    </span>
                                </span>
                        </button>
                    </div>
                </div>
            </form>
            {
                showUsuarios && (
                    <TableComponent data={usuariosData} options={options}/>
                )
            }
        </>
    );
}