import {useContext} from "react";

import {AltaClienteFormComponent} from "./AltaClienteFormComponent";
import {AltaClienteComplementario} from "./AltaClienteComplementario";
import {Layout} from "../../commons";
import {AltaClienteContext} from "../../../context/AltaCliente/AltaClienteContext";



export const AltaClientesComponent = () => {

    const optionModule ={
        title:'Operación',
        module:'Alta de Usuarios'
    }

    const {propForm} = useContext(AltaClienteContext);

    return(
            <Layout moduleName={optionModule}>
                <AltaClienteFormComponent />
                {
                  propForm.complementarios && <AltaClienteComplementario/>
                }
            </Layout>
    );
}