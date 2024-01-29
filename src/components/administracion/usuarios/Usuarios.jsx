import {Layout,CardLayout} from "../../commons";
import {AgregaUsuario} from "./AgregaUsuario";
import {TabsLayout} from "../../commons/tabs";
import {AsignaUsuario} from "./AsignaUsuario";
import {BloqueaUsuario} from "./BloqueaUsuario";
import {ConsultaUsuarios} from "./ConsultaUsuarios";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const Usuarios = () => {

    const moduleName= {
        title: 'Administración',
        module: "Usuarios",
        icon: "bi bi-person me-2"
    };

    const tabs = [
        {id:'alta-usuario',name:'Alta Usuario',icon:'bi bi-person-plus-fill me-2', element: <AgregaUsuario/>},
        {id:'consulta-usuario',name:'Consulta Usuario',icon:'bi bi-search me-2', element: <ConsultaUsuarios/>},
        {id:'asigna-suc',name:'Asignar Usuarios',icon:'bi bi-person-check-fill me-2',element:<AsignaUsuario/>},
        {id:'bloq-usuario',name:'Bloquear/Desbloquear Usuario',icon:'bi bi-person-fill me-2',element: <BloqueaUsuario/>},
    ];

    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);

    return(
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.module} icon="bi bi-person p-1">
                <TabsLayout tabs={tabs}/>
            </CardLayout>
        </Layout>
    )
}