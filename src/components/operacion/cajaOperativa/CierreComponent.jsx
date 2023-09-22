import {CuentaCajaComponent} from "./CuentaCajaComponent";

export const CierreComponent = () => {
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <CuentaCajaComponent tipo='Cierre'/>
                </div>
            </div>
        </>
    );
}