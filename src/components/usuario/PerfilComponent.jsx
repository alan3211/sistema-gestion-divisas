import {Layout} from "../commons";
import {UserCard} from "./UserCard";
import {TabsLayout} from "../commons/tabs";
import {ResumenUsuario} from "./ResumenUsuario";
import {EditarUsuario} from "./EditarUsuario";
import {CambiarPassword} from "./CambiarPassword";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export const PerfilComponent = () => {

    const optionModule ={
        title:'Inicio',
        module:'Mi Perfil'
    }

    const tabs = [
        {id:'resumen',name:'Resumen',icon:'bi bi-file-earmark-text me-2', element: <ResumenUsuario/>},
        {id:'cambiarPass',name:'Cambiar Contraseña',icon:'bi bi-key me-2', element: <CambiarPassword/>},
    ]

    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);

    return (
        <>
            <Layout moduleName={optionModule}>
                <section className="section profile">
                    <div className="row">
                        <div className="col-xl-5">
                           <UserCard/>
                        </div>

                        <div className="col-xl-7">
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