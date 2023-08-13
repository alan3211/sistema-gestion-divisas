import {useContext} from "react";
import {CargaTipoCambioContext} from "../../../context/CargaTipoCambio/CargaTipoCambioContext";
import {TipoCambioForm} from "./TipoCambioForm";
import {InputComponent} from "../../commons/inputs";
import {formattedDate} from "../../../utils";

export const CargaTipoCambio = () => {

    const {tipo} = useContext(CargaTipoCambioContext);

    console.log(tipo);

    return(
        <>
            <form className="row m-1 g-3 needs-validation was-validated justify-content-center" noValidate>
                <div className="col-md-6">
                    <div className="row d-flex justify-content-center">
                        {
                            tipo === 1 && (
                            <InputComponent
                                    nombre="Región"
                                    name="region"
                                    tipo="select"
                                    texto="Seleccione la región"
                                    estilo="col-md-7"
                                    id_catalogo={16}
                            />)

                        }
                        {
                            tipo === 2 && (
                                <InputComponent
                                    nombre="Sucursal"
                                    name="sucursal"
                                    tipo="select"
                                    texto="Seleccione la sucursal"
                                    estilo="col-md-7"
                                    id_catalogo={17}
                                />)

                        }
                        <TipoCambioForm/>
                    </div>
                </div>
                <div className="col-md-12 d-flex justify-content-center">
                    <button type="button" className="btn btn-primary" >
                        Guardar
                    </button>
                </div>
            </form>
        </>
    )
}