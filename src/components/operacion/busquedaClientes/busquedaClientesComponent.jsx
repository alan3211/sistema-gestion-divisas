import {useContext, useEffect, useState} from "react";
import './busquedaClientes.css';
import {CardLayout,} from "../../commons";
import {FormCliente} from "./FormCliente";
import {ClienteCoincidenciaComponent} from "./ClienteCoincidenciaComponent";
import {DatosClientes} from "./DatosClientes";

import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";


export const BusquedaClientesComponent = ({cliente}) => {

    const {busquedaCliente:{showCliente,data,setData},operacion} = useContext(CompraVentaContext);

    /*useEffect(() => {
        console.log("BUSQUEDA CLIENTES COMPONENT", cliente);
        if (cliente) setShowCliente(true);
    }, [cliente])*/

    const [selectedOption, setSelectedOption] = useState("cliente");

    const handleRadioChange = ({target:{value}}) => {
        setSelectedOption(value);
    };

    return (
        <>
            <CardLayout title="Búsqueda de Clientes" icon="bi bi-search me-2">
                <div className="search-options">
                    <h6 className="card-title"> Buscar por:</h6>
                    <div className="radio-options m-2">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="cliente"
                                id="cliente"
                                value="cliente"
                                onChange={handleRadioChange}
                                checked={selectedOption === "cliente"}
                            />
                            <label className="form-check-label" htmlFor="cliente">
                                Número de Cliente
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="nombre"
                                id="nombre"
                                value="nombre"
                                onChange={handleRadioChange}
                                checked={selectedOption === "nombre"}
                            />
                            <label className="form-check-label" htmlFor="nombre">
                                Nombre
                            </label>
                        </div>
                    </div>
                </div>
                <FormCliente tipo={selectedOption}/>
            </CardLayout>

            {
                (data.length > 1) &&
                <ClienteCoincidenciaComponent
                    dataClientes={data}
                    setDataClientes={setData}
                    tools={{selecciona: true}}
                />
            }
            {
                showCliente && <DatosClientes operacion={operacion} cliente={data[0] || cliente}/>
            }
        </>
    );
}