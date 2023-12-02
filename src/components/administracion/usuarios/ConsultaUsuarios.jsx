import {useCatalogo} from "../../../hook";
import {useForm} from "react-hook-form";
import {dataG} from "../../../App";
import {encryptRequest} from "../../../utils";
import {accionesUsuario, consultaUsuarios} from "../../../services/administracion-services";
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
    }

    const [usuariosData,setUsuariosData] = useState([]);
    const [showUsuarios,setShowUsuarios] = useState(false);

    const consultarUsuarios = propForm.handleSubmit(async (data) => {
        const encryptedData = encryptRequest(data);
        const response = await consultaUsuarios(encryptedData);
        setUsuariosData(response);
        setShowUsuarios(true);
        propForm.reset();
    });

    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
    }

    return(
        <>
            <form className="row g-3 mt-3" onSubmit={consultarUsuarios} noValidate>
                <div className="col-md-3 mx-auto">
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
                            type="submit"
                            className="m-2 btn btn-primary d-grid gap-2">
                                <span
                                    className="bi bi-search me-2"
                                    role="status"
                                    aria-hidden="true">
                                    <span className="ms-2">
                                        Buscar
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