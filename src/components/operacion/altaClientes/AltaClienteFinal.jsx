import {AltaClienteFormComponent} from "./AltaClienteFormComponent";
import {AltaClienteComplementario} from "./AltaClienteComplementario";
import {useContext, useEffect} from "react";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";
import {useNavigate} from "react-router-dom";

export const AltaClienteFinal = () => {

    const {propForm} = useContext(AltaClienteContext);

    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);


    return (<>
        <div className="row">
            <div className="col-md-12">
                <AltaClienteFormComponent />
                {
                    propForm.complementarios && <AltaClienteComplementario/>
                }
            </div>
        </div>
    </>);
}