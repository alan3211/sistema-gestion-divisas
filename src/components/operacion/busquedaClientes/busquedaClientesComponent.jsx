import {useContext, useEffect, useState} from "react";
import './busquedaClientes.css';
import {CardLayout,} from "../../commons";
import {FormCliente} from "./FormCliente";
import {ClienteCoincidenciaComponent} from "./ClienteCoincidenciaComponent";
import {DatosClientes} from "./DatosClientes";

import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {ToastContainer} from "react-toastify";

export const BusquedaClientesComponent = () => {

    const {busquedaCliente:{showCliente,setShowCliente,data,setData},operacion} = useContext(CompraVentaContext);

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
                (data.total_rows > 1) &&
                <ClienteCoincidenciaComponent
                    dataClientes={data}
                    setDataClientes={setData}
                    setShowCliente={setShowCliente}
                />
            }
            {
                showCliente && <DatosClientes operacion={operacion} cliente={data.result_set[0] || {}}/>
            }
        </>
    );
}