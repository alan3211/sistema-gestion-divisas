import {
    AccionesCaja,
    AccionesSucursales,
    AccionesTesoreria,
    CancelarEnvioSucursal,
    CancelarTesoreria,
    Detalle,
    EstatusTool,
    SeleccionarCliente, VerDenominaciones, ImpresionTicket, DetalleDenominaciones, VerSucursales, CancelarOperacion,
    IndicadoresDivisas, AccionesBoveda,CancelarEnvioBoveda,MontoSolicitud,OperacionEstatus,UsuariosSistema,
    SolicitaDotacion,RecepcionCancelar
} from "../componentes-tools";

const toolComponents = {
    estatus: EstatusTool,
    detalle: Detalle,
    'acciones-tesoreria': AccionesTesoreria,
    'cancelar-tesoreria': CancelarTesoreria,
    'cancelar-envio-sucursal': CancelarEnvioSucursal,
    'acciones-sucursales': AccionesSucursales,
    'selecciona-cliente': SeleccionarCliente,
    'acciones-caja': AccionesCaja,
    'ver-denominaciones': VerDenominaciones,
    'impresion-ticket': ImpresionTicket,
    'ver-detalle-denominacion': DetalleDenominaciones,
    'ver-sucursales': VerSucursales,
    'cancelar-operacion': CancelarOperacion,
    'indicadores-divisas': IndicadoresDivisas,
    'monto-solicitud': MontoSolicitud,
    'cancelar-envio-boveda': CancelarEnvioBoveda,
    'acciones-boveda': AccionesBoveda,
    'operacion-estatus':OperacionEstatus,
    'usuarios-sistema':UsuariosSistema,
    'detalle-solicitud':SolicitaDotacion,
    'recepcion-cancelar':RecepcionCancelar,

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