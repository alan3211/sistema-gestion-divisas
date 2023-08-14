const URL = 'http://grocerys-centro-cambiario.f7aae8b7e5akc0a9.eastus.azurecontainer.io:9000/';
//const URL = 'http://localhost:9000/';

export const LOGIN_URL = `${URL}login/`;
export const LOGIN_KEY_URL = `${URL}login/key/`;


export const INICIO_URL = `${URL}inicio/`;
export const CATALOGOS_URL = `${URL}catalogos/`;
export const CATALOGOSUSUARIOS_URL = `${URL}catalogos/usuarios/`;
export const OPERACIONES_URL = `${URL}operaciones/`;

export const OPERACIONES_ALTACLIENTE_URL = `${OPERACIONES_URL}altaClientes`
export const OPERACIONES_VALIDACLIENTE_URL = `${OPERACIONES_URL}validaCliente`
export const OPERACIONES_TIPOCAMBIO_URL = `${OPERACIONES_URL}tipoCambio`
export const OPERACIONES_CONVERSION_URL = `${OPERACIONES_URL}conversion`
export const OPERACIONES_BUSCACLIENTE_URL = `${OPERACIONES_URL}buscaCliente`
export const OPERACIONES_HACEROPERACION_URL = `${OPERACIONES_URL}realiza/preoperacion`
export const OPERACIONES_REALIZAOPERACION_URL = `${OPERACIONES_URL}realiza/operacion`
export const OPERACIONES_CONSULTALDENOMINACIONES_URL = `${OPERACIONES_URL}consulta/denominaciones/`
export const OPERACIONES_CONSULTACAJA_URL = `${OPERACIONES_URL}caja/consulta`
