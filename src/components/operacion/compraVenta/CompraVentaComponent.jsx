import {TipoCambioComponent} from "./TipoCambioComponent";
import {CalculadoraDivisasComponent} from "./CalculadoraDivisasComponent";
import {useContext} from "react";
import {BusquedaClientesComponent} from "../busquedaClientes";
import {Layout} from "../../commons";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {AltaClienteProvider} from "../../../context/AltaCliente/AltaClienteProvider";
import {AltaClienteFinal} from "../altaClientes/AltaClienteFinal";

export const CompraVentaComponent = () =>{

    const compraVentaProvider = useContext(CompraVentaContext);

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

            {
                compraVentaProvider.showAltaCliente && (<>
                    <AltaClienteProvider><AltaClienteFinal/></AltaClienteProvider>
                </>)
            }

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