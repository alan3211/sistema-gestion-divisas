import {DENOMINACIONES, FormatoMoneda} from "../../../utils";

export const ConsultaTotalesSuc = ({data}) => {
    return (
        <>
            <div className="p-3 d-flex">
                <div className="card info-card revenue-card">
                    <h5 className="card-title">
                        <i className="bi bi-cash ms-4 me-2"></i>
                        <strong>Disponible</strong>
                    </h5>
                    <div className="card-body">
                        {
                            data.map((elemento => {
                               return <>
                                   <h5 className="card-title">{elemento.moneda} <span>| {DENOMINACIONES[elemento.moneda]}</span></h5>
                                   <div className="d-flex align-items-center">
                                       <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                           <i className="bi bi-currency-dollar"></i>
                                       </div>
                                       <div className="ps-3">
                                           <h6>
                                               {FormatoMoneda(parseFloat(elemento.Total))}
                                           </h6>
                                           <span className="text-success small pt-1 fw-bold">
                                              {parseInt(elemento.Disponible)}
                                            </span>
                                           <span className="text-muted small pt-2 ms-1">
                                                {
                                                    parseInt(elemento.Disponible) > 1 || parseInt(elemento.Disponible) === 0 ? 'billetes disponibles':'billete disponible'
                                                }
                                           </span>
                                           <br />
                                       </div>
                                   </div>
                               </>
                            }))
                        }
                    </div>

                </div>
            </div>
        </>
    );
}