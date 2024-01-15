//const URL = 'https://grocerys-back.wittysmoke-209c31ac.eastus.azurecontainerapps.io/';
const URL = 'http://192.168.101.45:9000/';
//const URL = 'http://localhost:9000/';

export const LOGIN_URL = `${URL}login/`;

export const INICIO_URL = `${URL}inicio/`;
export const TOKEN_URL = `${URL}token`;
export const REFRESH_TOKEN_URL = `${URL}refresh-token`;
export const CATALOGOS_URL = `${URL}catalogos/`;
export const CATALOGOS_LOCALIDAD_URL = `${URL}catalogos/localidad/`;
export const CATALOGOSUSUARIOS_URL = `${URL}catalogos/usuarios/`;
export const CATALOGOS_GUARDADO_URL = `${URL}catalogos/guarda/`;
export const OPERACIONES_URL = `${URL}operaciones/`;
export const TESORERIA_URL = `${URL}tesoreria/`;
export const LOGISTICA_URL = `${URL}logistica/`;
export const SUCURSAL_URL = `${URL}sucursal/`;
export const CAJA_URL = `${URL}caja/`;
export const PERFIL_URL = `${URL}perfil/`;
export const REPORTES_URL = `${URL}reportes/`;
export const ADMINISTRACION_URL = `${URL}administracion/`;
export const TOOLS_URL = `${URL}tools/`;
export const LOGIN_FIN_SESION_URL = `${LOGIN_URL}finSesion`;



export const OPERACIONES_ALTACLIENTE_URL = `${OPERACIONES_URL}altaClientes`
export const OPERACIONES_VALIDACLIENTE_URL = `${OPERACIONES_URL}validaCliente`
export const OPERACIONES_TIPOCAMBIO_URL = `${OPERACIONES_URL}tipoCambio`
export const OPERACIONES_CONSULTA_TIPOCAMBIO_URL = `${OPERACIONES_URL}tipoCambio/consulta`
export const OPERACIONES_CONVERSION_URL = `${OPERACIONES_URL}conversion`
export const OPERACIONES_BUSCACLIENTE_URL = `${OPERACIONES_URL}buscaCliente`
export const OPERACIONES_HACEROPERACION_URL = `${OPERACIONES_URL}realiza/preoperacion`
export const OPERACIONES_REALIZAOPERACION_URL = `${OPERACIONES_URL}realiza/operacion`
export const OPERACIONES_CONSULTALDENOMINACIONES_URL = `${OPERACIONES_URL}consulta/denominaciones`
export const OPERACIONES_ENVIAMENSAJES_URL = `${OPERACIONES_URL}envia/mensaje`
export const OPERACIONES_VALIDA_INFORMACION_URL = `${OPERACIONES_URL}valida/informacion`
export const OPERACIONES_RESGUARDA_FACTURA_URL = `${OPERACIONES_URL}resguarda/factura`

export const TESORERIA_CONSULTA_SALDO_URL = `${TESORERIA_URL}consulta`
export const TESORERIA_DOTACION_SUCURSALES_URL = `${TESORERIA_URL}dotacion-sucursal/dota`
export const TESORERIA_ESTATUS_DOTACIONES_URL = `${TESORERIA_URL}dotacion-sucursal/estatus`
export const TESORERIA_ENVIO_SUCURSAL_URL = `${TESORERIA_URL}dotacion-sucursal/consulta-envio`
export const TESORERIA_RESUMEN_SUCURSAL_URL = `${TESORERIA_URL}consulta/resumen-sucursal`

/*Logistica*/
export const LOGISTICA_REALIZA_DOTACION_BOVEDA = `${LOGISTICA_URL}dotacion/boveda/solicita`
export const LOGISTICA_CONSULTA_DOTACION_BOVEDA = `${LOGISTICA_URL}dotacion/boveda/consulta`
export const LOGISTICA_GENERA_DOTACION_BOVEDA = `${LOGISTICA_URL}dotacion/boveda/genera`
export const LOGISTICA_ACCIONES_DOTACION_BOVEDA = `${LOGISTICA_URL}dotacion/boveda/acciones`
export const LOGISTICA_ASIGNA_FONDOS_SUCURSAL = `${LOGISTICA_URL}asigna/boveda/sucursal`
export const LOGISTICA_CONSULTA_CANTIDAD_SUCURSAL = `${LOGISTICA_URL}consulta/boveda/cantidad`
export const LOGISTICA_ENVIA_FONDOS_SUCURSAL = `${LOGISTICA_URL}envia-dotacion/sucursal`

/*OPERACION SUCURSAL*/
export const SUCURSAL_ENVIO_VALORES_URL = `${SUCURSAL_URL}operativa/envio-valores`
export const SUCURSAL_DOTA_CAJA_URL = `${SUCURSAL_URL}operativa/dota-caja`
export const SUCURSAL_CONSULTA_DOTACIONES_URL = `${SUCURSAL_URL}operativa/consulta-dotacion`
export const SUCURSAL_MOVIMIENTOS_URL = `${SUCURSAL_URL}operativa/movimientos`
export const SUCURSAL_DISPONIBLE_URL = `${SUCURSAL_URL}operativa/disponible`
export const SUCURSAL_DISPONIBLE_DIVISAS_URL = `${SUCURSAL_URL}consulta/disponible`
export const SUCURSAL_DISPONIBLE_DIVISAS_CAJA_URL = `${SUCURSAL_URL}consulta/disponible/cajas`
export const SUCURSAL_SOLICITUD_CAMBIO_URL = `${SUCURSAL_URL}solicitud/cambio`

export const SUCURSAL_CIERRE_DIA_URL = `${SUCURSAL_URL}cierre`

/*OPERACION CAJA*/
export const CAJA_CONSULTA_DOTACIONES_URL = `${CAJA_URL}consulta/dotaciones`
export const CAJA_CONSULTA_URL = `${CAJA_URL}consulta`
export const CAJA_ENTREGA_URL = `${CAJA_URL}entrega`
export const CAJA_CONSULTA_DIVISAS_URL = `${CAJA_URL}consulta/divisas`
export const CAJA_CONSULTA_MOVIMIENTOS_URL = `${CAJA_URL}consulta/movimientos`

/* CONSULTA DE REPORTES CONTABLES */
export const REPORTES_CONSULTA_URL = `${REPORTES_URL}consulta`
export const REPORTES_CONSULTA_REPORTES_URL = `${REPORTES_URL}consulta/reporte`
export const REPORTES_CONSULTA_TITULO_URL = `${REPORTES_URL}consulta/titulo`

/* USUARIO PERFIL*/
export const PERFIL_EDITA_URL = `${PERFIL_URL}actualiza`
export const PERFIL_CAMBIA_PASS_URL = `${PERFIL_URL}cambia/password`

/*ENDPOINTS DE TOOLS*/
export const TOOLS_CONSULTA_DETALLE_URL = `${TOOLS_URL}consulta/detalle`
export const TOOLS_CANCELAR_DOTACION_URL = `${TOOLS_URL}cancelar/dotacion`
export const TOOLS_ACCIONES_DOTACION_URL = `${TOOLS_URL}acciones/dotacion`
export const TOOLS_ACCIONES_SUCURSAL_URL = `${TOOLS_URL}acciones/dotacion-sucursal`
export const TOOLS_CANCELAR_DOTACION_SUCURSAL_URL = `${TOOLS_URL}cancelar/dotacion-sucursal`
export const TOOLS_OBTIENE_DENOMINACIONES_URL = `${TOOLS_URL}consulta/denominaciones`
export const TOOLS_OBTIENE_DENOMINACIONES_CAJA_URL = `${TOOLS_URL}consulta/denominaciones/caja`

export const TOOLS_OBTIENE_DENOMINACIONES_BOVEDA_URL = `${TOOLS_URL}consulta/denominaciones/boveda`

export const TOOLS_ACCIONES_CAJA_URL = `${TOOLS_URL}acciones/dotacion-caja`
export const TOOLS_MUESTRA_DENOMINACIONES_URL = `${TOOLS_URL}muestra/denominaciones`

export const TOOLS_CONSULTA_DETALLE_DENOMINACIOENS_URL = `${TOOLS_URL}consulta/detalle/denominaciones`

export const TOOLS_OBTIENE_DATOS_TICKET_URL = `${TOOLS_URL}consulta/datosTicket`
export const TOOLS_OBTIENE_NOTIFICACIONES_URL = `${TOOLS_URL}obtiene/notificaciones`
export const TOOLS_ACTUALIZA_NOTIFICACIONES_URL = `${TOOLS_URL}actualiza/notificaciones`
export const TOOLS_OBTIENE_ACTIVIDAD_RECIENTE_URL = `${TOOLS_URL}obtiene/actividad-reciente`
export const TOOLS_CANCELAR_OPERACION_URL = `${TOOLS_URL}cancelar/operacion`
export const TOOLS_CONSULTA_ULTIMOS_MOVIMIENTOS_URL = `${TOOLS_URL}consulta/ultimos-movimientos`
export const TOOLS_CONSULTA_ACT_RECIENTE_URL = `${TOOLS_URL}consulta/actividad-reciente`

export const TOOLS_CONSULTA_VENTAS_FECHA_URL = `${TOOLS_URL}consulta/ventas-fecha`
export const TOOLS_CONSULTA_COMPRAS_FECHA_URL = `${TOOLS_URL}consulta/compras-fecha`
export const TOOLS_SOLICITUD_ENVIO_VALORES_URL = `${TOOLS_URL}solicitud/envio-valores`

/*Modulo de administracion*/
export const ADMINISTRACION_CARGATIPOCAMBIO_URL = `${ADMINISTRACION_URL}cargaTipoCambio`
export const ADMINISTRACION_USUARIO_ALTA_URL = `${ADMINISTRACION_URL}usuario/alta`
export const ADMINISTRACION_USUARIO_CONSULTA_URL = `${ADMINISTRACION_URL}usuario/consulta`