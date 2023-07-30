import {TableComponent} from "../../commons/tables/TableComponent";
import {InputComponent} from "../../commons/inputs/InputComponent";

export const ClienteCoincidenciaComponent = ({dataClientes,tools,showAddCliente,addCliente,setData,setShowCliente}) =>{

    const hacerOperacion = (item) => {
        setData(item);
        setShowCliente(true);
    }

    return(
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">
                    <i className="bx bxs-user-detail p-2"></i>
                    <strong>Clientes con coincidencias</strong>
                </h5>
                <TableComponent data={dataClientes} tools={tools} setData={setData} hacerOperacion={hacerOperacion}/>
                {
                    showAddCliente && <InputComponent key="nuevoRegistro"
                                                      nombre="Nuevo Cliente"
                                                      tipo="button"
                                                      estilo="col-md-4"
                                                      estiloBtn="m-2 btn btn-primary d-grid gap-2"
                                                      fn={addCliente}
                    />
                }
            </div>
        </div>
    );
}