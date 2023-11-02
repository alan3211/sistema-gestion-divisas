import {DENOMINACIONES, FormatoMoneda, redondearNumero} from "../../../utils";

export const ConsultaTotalesCajeros = ({ data }) => {
    return (
        <>
            <div className="p-3 d-flex">
                {Object.keys(data).map((cajero, index) => (
                    <div className="card info-card revenue-card m-2" key={cajero}>
                        <h5 className="card-title">
                            <i className="bi bi-person-circle ms-4 me-2"></i>
                            <strong>Cajero {cajero}</strong>
                        </h5>
                        {data[cajero].map((elemento, elementoIndex) => (
                            <div className="card-body" key={`${cajero}-${elementoIndex}`}>
                                <h5 className="card-title">
                                    {elemento.Moneda} <span>| {DENOMINACIONES[elemento.Moneda]}</span>
                                </h5>
                                <div className="d-flex align-items-center">
                                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i className="bi bi-currency-dollar"></i>
                                    </div>
                                    <div className="ps-3">
                                        <h6>{FormatoMoneda(parseFloat(elemento.Monto))}</h6>
                                        <span className="text-success small pt-1 fw-bold">
                                            {parseInt(elemento.Billetes)}
                                        </span>
                                        <span className="text-muted small pt-2 ms-1">
                                        {parseInt(elemento.Billetes) > 1 || parseInt(elemento.Billetes) === 0
                                            ? 'billetes disponibles'
                                            : 'billete disponible'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};
