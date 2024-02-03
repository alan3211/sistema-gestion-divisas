import {TitleComponent} from "../../commons";
import {TablaDivisasComponent} from "./TablaDivisasComponent";
import {useState} from "react";
import {formattedDate} from "../../../utils";

export const TipoCambioComponent = () => {

    const title = 'Tipo de Cambio';
    const [fechaConsulta] = useState(formattedDate)

    return (
        <div className="card shadow">
            <div className="card-body">
                <TitleComponent title={title} fecha={fechaConsulta} a icon="bi bi-currency-exchange p-2"/>
                <TablaDivisasComponent/>
            </div>
        </div>
    )
}