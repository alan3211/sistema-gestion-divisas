import {TableComponent} from "../../commons/tables";
import {CardLayout} from "../../commons";

export const ClienteCoincidenciaComponent = ({dataClientes,showAddCliente,addCliente,setDataClientes,setShowCliente}) =>{

    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
        tools: [
            {columna:"Selecciona",tool:'selecciona-cliente',deps:{setDataClientes,setShowCliente}},
        ]
    }

    return(
        <CardLayout title="Clientes con coincidencias" icon="bx bxs-user-detail p-2">
            <TableComponent data={dataClientes} options={options}/>
            {
                showAddCliente &&
                (
                    <div className="col-md-4">
                        <div className="form-floating">
                            <button
                                type="button"
                                className="m-2 btn btn-primary d-grid gap-2"
                                onClick={addCliente}>

                                <span
                                    className="bi bi-person-plus-fill me-2"
                                    role="status"
                                    aria-hidden="true">

                                    <span className="ms-2">
                                        Nuevo Cliente
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>
                )
            }
        </CardLayout>
    );
}