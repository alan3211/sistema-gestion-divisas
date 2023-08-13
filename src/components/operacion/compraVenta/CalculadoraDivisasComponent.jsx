import {TitleComponent} from "../../commons";
import {CalculadoraFormComponent} from "./CalculadoraFormComponent";

export const CalculadoraDivisasComponent = () => {
    return (
        <div className="card shadow">
            <div className="card-body">
                <TitleComponent title="Cotización" icon="ri-exchange-dollar-fill p-2" />
                <CalculadoraFormComponent key="calculadora-divisas"/>
            </div>
        </div>
    );
}