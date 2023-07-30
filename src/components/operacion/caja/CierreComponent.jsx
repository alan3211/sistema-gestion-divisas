import {CuentaCajaComponent} from "./CuentaCajaComponent";

export const CierreComponent = () => {
    return (
        <>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center m-2">
                    <h5 className="card-title">
                        <strong>Entrega</strong>
                    </h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <CuentaCajaComponent/>
                </div>
            </div>
        </>
    );
}