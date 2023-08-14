import {TitleComponent} from "../../commons/TitleComponent";
import {TablaDivisasComponent} from "./TablaDivisasComponent";
import {useContext} from "react";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";

export const TipoCambioComponent = () => {

    const title = 'Tipo de Cambio';

    return (
        <div className="card shadow">
            <div className="card-body">
                <TitleComponent title={title} icon="bi bi-currency-exchange p-2" fecha/>
                <TablaDivisasComponent/>
            </div>
        </div>
    )
}