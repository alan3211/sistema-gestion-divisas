import {DENOMINACIONES, FormatoMoneda} from "../../../../utils";

export const ConsultaTotalesCaja = ({data}) => {
    return (
        <>
            <div className="col-md-3">
                <div className="card info-card revenue-card">
                    <div className="card-body">
                        <h5 className="card-title">{data.Moneda} <span>| {DENOMINACIONES[data.Moneda]}</span></h5>

                        <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                <i className="bi bi-currency-dollar"></i>
                            </div>
                            <div className="ps-3">
                                <h6>{FormatoMoneda(parseFloat(data.Monto))}</h6>
                                <span className="text-success small pt-1 fw-bold">
                                    {parseInt(data.Billetes)}
                                </span>
                                <span className="text-muted small pt-2 ps-1">
                                    {
                                         parseInt(data.Billetes) > 1 || parseInt(data.Billetes) === 0 ? 'billetes disponibles':'billete disponible'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}