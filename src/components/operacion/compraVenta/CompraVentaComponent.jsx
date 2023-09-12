import {TipoCambioComponent} from "./TipoCambioComponent";
import {CalculadoraDivisasComponent} from "./CalculadoraDivisasComponent";
import {useContext, useEffect} from "react";
import {BusquedaClientesComponent} from "../busquedaClientes";
import { useLocation } from 'react-router-dom';
import {Layout} from "../../commons";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";

export const CompraVentaComponent = () =>{

    const compraVentaProvider = useContext(CompraVentaContext);

    const location = useLocation();
    const { cliente='',clienteActivo } = location.state;

    useEffect(() => {
        if (clienteActivo) {
            compraVentaProvider.setContinuaOperacion(true);
            console.log("CLIENTE:",cliente)
            compraVentaProvider.setCliente(cliente);
        }
    }, [clienteActivo, cliente]);

    const moduleName = {
        title: 'Operación',
        module: 'Compra/Venta'
    }

    return (
        <Layout moduleName={moduleName}>
            <div className="row">
                <div className="col-md-6">
                    <CalculadoraDivisasComponent/>
                </div>
                <div className="col-md-6">
                    <TipoCambioComponent />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    {
                        compraVentaProvider.continuaOperacion && <BusquedaClientesComponent/>
                    }
                </div>
            </div>
        </Layout>
    );
}