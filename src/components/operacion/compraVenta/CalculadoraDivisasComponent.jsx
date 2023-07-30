import {TitleComponent} from "../../commons/TitleComponent";
import {CalculadoraFormComponent} from "./CalculadoraFormComponent";

export const CalculadoraDivisasComponent = ({tipoDivisa,setOperacion,setContinuaOperacion}) => {
    return (
        <div className="card shadow">
            <div className="card-body">
                <TitleComponent title="Cotización" icon="ri-exchange-dollar-fill p-2" />
                <CalculadoraFormComponent key="calculadora-divisas" tipoDivisa={tipoDivisa} setOperacion={setOperacion} setContinuaOperacion={setContinuaOperacion}/>
            </div>
        </div>
    );
}