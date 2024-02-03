import {TipoCambioComponent} from "./TipoCambioComponent";
import {CalculadoraDivisasComponent} from "./CalculadoraDivisasComponent";
import {useContext, useEffect} from "react";
import {BusquedaClientesComponent} from "../busquedaClientes";
import {Layout} from "../../commons";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";
import {AltaClienteProvider} from "../../../context/AltaCliente/AltaClienteProvider";
import {AltaClienteFinal} from "../altaClientes/AltaClienteFinal";
import {useNavigate} from "react-router-dom";

export const CompraVentaComponent = () =>{

    const compraVentaProvider = useContext(CompraVentaContext);

    const moduleName = {
        title: 'Operación',
        module: 'Compra/Venta'
    }

    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);

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