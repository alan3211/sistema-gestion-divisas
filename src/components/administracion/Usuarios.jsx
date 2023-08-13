import {Layout,CardLayout} from "../commons/";

export const Usuarios = () => {

    const moduleName = {
        title: 'Administración',
        module: 'Usuarios'
    }

    return(
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.module} icon="bi bi-person p-1">
                <p>Usuarios</p>
            </CardLayout>
        </Layout>
    )
}