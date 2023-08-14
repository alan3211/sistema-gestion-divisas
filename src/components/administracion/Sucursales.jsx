import {Layout,CardLayout} from "../commons/";

export const Sucursales = () => {

    const moduleName = {
        title: 'Administración',
        module: 'Sucursales'
    }

    return(
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.module} icon="bi bi-building p-1">
                <p>Sucursales</p>
            </CardLayout>
        </Layout>
    )
}