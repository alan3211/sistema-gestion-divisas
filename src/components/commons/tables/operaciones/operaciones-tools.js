import {
    AccionesCaja,
    AccionesSucursales,
    AccionesTesoreria,
    CancelarEnvioSucursal,
    CancelarTesoreria,
    Detalle,
    EstatusTool,
    SeleccionarCliente, VerDenominaciones, ImpresionTicket, DetalleDenominaciones, VerSucursales, CancelarOperacion,
    IndicadoresDivisas, AccionesBoveda, CancelarEnvioBoveda, MontoSolicitud, OperacionEstatus, UsuariosSistema,
    SolicitaDotacion, AccionesRecepcionValores, AccionesEnvioValores, AccionesUsuariosSistema,
} from "../componentes-tools";
import {AlarmasPLD} from "../componentes-tools/pld/alarmas/AlarmasPLD";
import {Analisis} from "../componentes-tools/pld/analisis/Analisis";
import {DescargaReporte} from "../componentes-tools/pld/reportes/DescargaReporte";

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
    'acciones-recepcion-valores':AccionesRecepcionValores,
    'acciones-envio-valores': AccionesEnvioValores,
    'acciones-usuarios-sistema': AccionesUsuariosSistema,
    'ver-detalle-alarma': AlarmasPLD,
    'analisis': Analisis,
    'descarga-reporte': DescargaReporte,
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