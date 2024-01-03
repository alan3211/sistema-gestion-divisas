import {TitleComponent} from "../../commons";
import {TablaDivisasComponent} from "./TablaDivisasComponent";

export const TipoCambioComponent = () => {

    const title = 'Tipo de Cambio';

    return (
        <div className="card shadow">
            <div className="card-body">
                <TitleComponent title={title} icon="bi bi-currency-exchange p-2"/>
                <TablaDivisasComponent/>
            </div>
        </div>
    )
}