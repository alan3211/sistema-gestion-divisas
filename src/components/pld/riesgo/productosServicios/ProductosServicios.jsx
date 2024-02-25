export const ProductosServicios = ({tipo}) => {

    if(tipo === 1){
        return (<>
            <table className="col-md-3 table table-striped table-blue mt-2 text-center mx-auto">
                <thead>
                <tr>
                    <th>Operación</th>
                    <th>Riesgo</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Compra Dólares</td>
                        <td>Medio Riesgo</td>
                    </tr>
                    <tr>
                        <td>Venta Dólares</td>
                        <td>Medio Riesgo</td>
                    </tr>
                </tbody>
            </table>
        </>);
    }else if(tipo === 2){
        return (<>
            <table className="col-md-3 table table-striped table-blue mt-2 text-center mx-auto">
                <thead>
                <tr>
                    <th>Tipos de usuarios</th>
                    <th>Riesgo</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Mayores de 65 años </td>
                    <td>Medio Riesgo</td>
                </tr>
                <tr>
                    <td>De 18 a 25 con actividad (Sin Ocupación,Ama de Casa, estudiante)</td>
                    <td>Alto Riesgo</td>
                </tr>
                </tbody>
            </table>
        </>);
    }else if(tipo === 3){
        return (<>
            <table className="col-md-3 table table-striped table-blue mt-2 text-center mx-auto">
                <thead>
                <tr>
                    <th>Estado</th>
                    <th>Riesgo</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Tamaulipas</td>
                    <td>Alto Riesgo</td>
                </tr>
                <tr>
                    <td>Nuevo Leon</td>
                    <td>Alto Riesgo</td>
                </tr>
                <tr>
                    <td>Coahuila</td>
                    <td>Alto Riesgo</td>
                </tr>
                <tr>
                    <td>Chihuahua</td>
                    <td>Alto Riesgo</td>
                </tr>
                <tr>
                    <td>Sonora</td>
                    <td>Alto Riesgo</td>
                </tr>
                <tr>
                    <td>Queretaro</td>
                    <td>Alto Riesgo</td>
                </tr>

                </tbody>
            </table>
        </>);
    }else{
        return (<>
            <table className="col-md-3 table table-striped table-blue mt-2 text-center mx-auto">
                <thead>
                <tr>
                    <th>Canal</th>
                    <th>Riesgo</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Ventanilla</td>
                    <td>Medio Riesgo</td>
                </tr>
                </tbody>
            </table>
        </>);
    }

}