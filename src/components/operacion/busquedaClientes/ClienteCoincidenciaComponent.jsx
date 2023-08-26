import {TableComponent} from "../../commons/tables";
import {CardLayout} from "../../commons";
import {useNavigate} from "react-router-dom";

export const ClienteCoincidenciaComponent = ({dataClientes,tools,showAddCliente,addCliente,setDataClientes}) =>{

    const navigate =  useNavigate();

    const hacerOperacion = (item) => {
        setDataClientes(item);
        console.log("CLIENTE A ENVIAR DESDE -> CLIENTE COINCIDENCIA:",item)
        navigate("/compraVenta", {
            state: {
                cliente: item,
                clienteActivo: true,
            },
        });
    }

    return(
        <CardLayout title="Clientes con coincidencias" icon="bx bxs-user-detail p-2">
            <TableComponent data={dataClientes} tools={tools} hacerOperacion={hacerOperacion}/>
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