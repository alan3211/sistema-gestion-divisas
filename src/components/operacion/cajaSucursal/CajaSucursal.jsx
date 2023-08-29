import {CardLayout, Layout} from "../../commons";

export const CajaSucursal = () => {

    const optionModule ={
        title:'Operación',
        module:'Caja Sucursal'
    }

    return(
            <Layout moduleName={optionModule}>
                <CardLayout title="Caja Sucursal" icon="bi-box-seam p-2">

                </CardLayout>
            </Layout>
    );
}