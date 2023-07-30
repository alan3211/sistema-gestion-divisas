import {TitleComponent} from "../../commons/TitleComponent";
import {TablaDivisasComponent} from "./TablaDivisasComponent";

export const TipoCambioComponent = ({setTipoDivisa}) => {

    const title = 'Tipo de Cambio';

    return (
        <div className="card shadow">
            <div className="card-body">
                <TitleComponent title={title} icon="bi bi-currency-exchange p-2" fecha/>
                <TablaDivisasComponent setTipoDivisa={setTipoDivisa}/>
            </div>
        </div>
    )
}