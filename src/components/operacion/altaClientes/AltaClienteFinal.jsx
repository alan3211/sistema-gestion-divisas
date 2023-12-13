import {AltaClienteFormComponent} from "./AltaClienteFormComponent";
import {AltaClienteComplementario} from "./AltaClienteComplementario";
import {useContext} from "react";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";

export const AltaClienteFinal = () => {

    const {propForm} = useContext(AltaClienteContext);

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