//const URL = 'http://grocerys-backend.cpd2aadzgsaweuax.eastus.azurecontainer.io:9000/';
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
export const SUCURSAL_URL = `${URL}sucursal/`;
export const CAJA_URL = `${URL}caja/`;
export const ADMINISTRACION_URL = `${URL}administracion/`;
export const TOOLS_URL = `${URL}tools/`;

export const OPERACIONES_ALTACLIENTE_URL = `${OPERACIONES_URL}altaClientes`
export const OPERACIONES_VALIDACLIENTE_URL = `${OPERACIONES_URL}validaCliente`
export const OPERACIONES_TIPOCAMBIO_URL = `${OPERACIONES_URL}tipoCambio`
export const OPERACIONES_CONVERSION_URL = `${OPERACIONES_URL}conversion`
export const OPERACIONES_BUSCACLIENTE_URL = `${OPERACIONES_URL}buscaCliente`
export const OPERACIONES_HACEROPERACION_URL = `${OPERACIONES_URL}realiza/preoperacion`
export const OPERACIONES_REALIZAOPERACION_URL = `${OPERACIONES_URL}realiza/operacion`
export const OPERACIONES_CONSULTALDENOMINACIONES_URL = `${OPERACIONES_URL}consulta/denominaciones`

export const TESORERIA_CONSULTA_SALDO_URL = `${TESORERIA_URL}consulta`
export const TESORERIA_DOTACION_SUCURSALES_URL = `${TESORERIA_URL}dotacion-sucursal/dota`
export const TESORERIA_ESTATUS_DOTACIONES_URL = `${TESORERIA_URL}dotacion-sucursal/estatus`
export const TESORERIA_ENVIO_SUCURSAL_URL = `${TESORERIA_URL}dotacion-sucursal/consulta-envio`

/*OPERACION SUCURSAL*/
export const SUCURSAL_ENVIO_VALORES_URL = `${SUCURSAL_URL}operativa/envio-valores`
export const SUCURSAL_DOTA_CAJA_URL = `${SUCURSAL_URL}operativa/dota-caja`
export const SUCURSAL_CONSULTA_DOTACIONES_URL = `${SUCURSAL_URL}operativa/consulta-dotacion`
export const SUCURSAL_MOVIMIENTOS_URL = `${SUCURSAL_URL}operativa/movimientos`
export const SUCURSAL_DISPONIBLE_URL = `${SUCURSAL_URL}operativa/disponible`

/*OPERACION CAJA*/
export const CAJA_CONSULTA_DOTACIONES_URL = `${CAJA_URL}consulta/dotaciones`
export const CAJA_CONSULTA_URL = `${CAJA_URL}consulta`
export const CAJA_ENTREGA_URL = `${CAJA_URL}entrega`


/*ENDPOINTS DE TOOLS*/
export const TOOLS_CONSULTA_DETALLE_URL = `${TOOLS_URL}consulta/detalle`
export const TOOLS_CANCELAR_DOTACION_URL = `${TOOLS_URL}cancelar/dotacion`
export const TOOLS_ACCIONES_DOTACION_URL = `${TOOLS_URL}acciones/dotacion`
export const TOOLS_ACCIONES_SUCURSAL_URL = `${TOOLS_URL}acciones/dotacion-sucursal`
export const TOOLS_CANCELAR_DOTACION_SUCURSAL_URL = `${TOOLS_URL}cancelar/dotacion-sucursal`
export const TOOLS_OBTIENE_DENOMINACIONES_URL = `${TOOLS_URL}consulta/denominaciones`

export const TOOLS_ACCIONES_CAJA_URL = `${TOOLS_URL}acciones/dotacion-caja`
export const TOOLS_MUESTRA_DENOMINACIONES_URL = `${TOOLS_URL}muestra/denominaciones`

/*Modulo de administracion*/
export const ADMINISTRACION_CARGATIPOCAMBIO_URL = `${ADMINISTRACION_URL}cargaTipoCambio`
export const ADMINISTRACION_USUARIO_ALTA_URL = `${ADMINISTRACION_URL}usuario/alta`