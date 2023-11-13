import {Usuarios} from "../Usuarios";
import {CompraVentaProvider} from "../../../../../context/compraVenta/CompraVentaProvider";
import {TipoCambioComponent} from "../../../../operacion/compraVenta";

export const TableroCoordinadorLogistico = ({usuarios}) => {

    return(

        <section className="section dashboard">
            <div className="row">
                <div className="col-md-6">
                    <Usuarios data={usuarios?.result_set?.[0] ||{} } />
                </div>
                <div className="col-md-6">
                    <CompraVentaProvider><TipoCambioComponent/></CompraVentaProvider>
                </div>
            </div>
        </section>

    );
}