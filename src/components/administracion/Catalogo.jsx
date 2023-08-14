import {Layout,CardLayout} from "../commons/";

export const Catalogo = () => {

    const moduleName = {
        title: 'Administración',
        module: 'Catalogos'
    }

    return(
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.module} icon="bi bi-list p-1">
                <p>Catalogos</p>
            </CardLayout>
        </Layout>
    )
}