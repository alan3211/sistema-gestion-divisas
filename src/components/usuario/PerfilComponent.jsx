import {Layout} from "../commons";
import {UserCard} from "./UserCard";
import {TabsLayout} from "../commons/tabs";
import {ResumenUsuario} from "./ResumenUsuario";
import {EditarUsuario} from "./EditarUsuario";
import {CambiarPassword} from "./CambiarPassword";
import {useState} from "react";

export const PerfilComponent = () => {

    const optionModule ={
        title:'Inicio',
        module:'Mi Perfil'
    }

    const tabs = [
        {id:'resumen',name:'Resumen',icon:'bi bi-file-earmark-text me-2', element: <ResumenUsuario/>},
        {id:'editarPerfil',name:'Editar Perfil',icon:'bi bi-pencil me-2', element: <EditarUsuario/>},
        {id:'cambiarPass',name:'Cambiar Contraseña',icon:'bi bi-key me-2', element: <CambiarPassword/>},
    ]

    return (
        <>
            <Layout moduleName={optionModule}>
                <section className="section profile">
                    <div className="row">
                        <div className="col-xl-4">
                           <UserCard/>
                        </div>

                        <div className="col-xl-8">
                            <div className="card">
                                <div className="card-body pt-3">
                                    <TabsLayout tabs={tabs}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}