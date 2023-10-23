import { formattedDate, mensajeSinOperaciones } from "../../../../utils";
import { MessageComponent } from "../../../commons";

export const Ventas = ({ data }) => {
    if (!!data) {
        return (
            <div className="col-md-3 mb-4">
                <div className="card sales-card border-0">
                    <div className="card-body text-center p-2">
                        <h5 className="card-title fw-bolder">Ventas <span>| {formattedDate}</span></h5>
                        <p className="text-blue small fw-bold">Total Ventas {0}</p>
                        <div className="mt-2">
                            <div
                                className="text-warning d-flex align-items-center justify-content-center mx-auto">
                                <i className="ri ri-error-warning-fill fs-1"></i>
                            </div>
                            <p className="text-muted small mb-1">
                                Por el momento no hay ventas al día de hoy.
                            </p>
                        </div>
                        <hr className="my-3" />
                    </div>
                </div>
            </div>
        );
    }

    const { 'No Operaciones': noOperaciones, Porcentaje, Sucursal, 'Nombre Sucursal': nombreSucursal, 'Total': totalVentas } = data;

    return (
        <div className="col-md-3 mb-4">
            <div className="card sales-card border-0">
                <div className="card-body text-center p-2">
                    <h5 className="card-title fw-bolder">Ventas <span>| {formattedDate}</span></h5>
                    <p className="text-blue small fw-bold">Total Ventas {totalVentas}</p>
                    <div className="mt-2">
                        <div className="rounded-circle card-icon d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-cart fs-2"></i>
                        </div>
                        <h6 className="mb-0 text-blue fw-bold">{noOperaciones} {noOperaciones === 1 ? 'Operación' : 'Operaciones'}</h6>
                        <p className="text-success small fw-bold">{Porcentaje}% de {nombreSucursal}</p>
                    </div>
                    <hr className="my-3" />
                    <div className="mb-3">
                        <div className="mt-2">
                            <p className="text-muted small mb-1">Sucursal con más ventas</p>
                            <p className="mb-0">
                                <i className="ri ri-store-3-line fs-4 text-muted"></i>
                                <strong>{nombreSucursal}</strong>
                            </p>
                            <p className="small fw-bolder"># {Sucursal}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
