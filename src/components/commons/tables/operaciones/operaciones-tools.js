import {
    AccionesSucursales,
    AccionesTesoreria,
    CancelarEnvioSucursal,
    CancelarTesoreria,
    Detalle,
    EstatusTool,
    SeleccionarCliente
} from "../componentes-tools";

const toolComponents = {
    estatus: EstatusTool,
    detalle: Detalle,
    'acciones-tesoreria': AccionesTesoreria,
    'cancelar-tesoreria': CancelarTesoreria,
    'cancelar-envio-sucursal': CancelarEnvioSucursal,
    'acciones-sucursales': AccionesSucursales,
    'selecciona-cliente': SeleccionarCliente,
};

export const getTools = (toolInfo, item, index) => {

    const ToolComponent = toolComponents[toolInfo.tool];

    if (ToolComponent) {
        return <ToolComponent item={item} index={index} columna={toolInfo.columna} params={toolInfo.params} refresh={toolInfo.refresh} deps={toolInfo.deps} />;
    } else {
        return (
            <td key={index} className="text-center">
                {item[toolInfo.columna]}
            </td>
        );
    }
}