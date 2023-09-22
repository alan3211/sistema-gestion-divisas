import {CuentaCajaComponent} from "./CuentaCajaComponent";

export const TraspasoComponent =  () => {

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <CuentaCajaComponent tipo="traspaso"/>
                </div>
            </div>
        </>
    );
}