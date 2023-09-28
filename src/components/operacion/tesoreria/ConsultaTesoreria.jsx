import {formateaMoneda, FormatoMoneda} from "../../../utils";
import {useSaldo} from "../../../hook/useSaldo";

export const ConsultaTesoreria = () => {

  const saldoGeneral = useSaldo();

    return(
        <div className="container d-flex justify-content-center align-items-center mt-3">
            <h5 className="text-blue text-center">
                <i className="bi bi-bank me-2"></i>
                 <span>Cuenta Bancaria:</span>
                <strong className="ms-2">{FormatoMoneda(parseFloat(saldoGeneral),'USD')}</strong>
            </h5>

        </div>
    );
}