import CryptoJS from "crypto-js";

const currentDate = new Date();
export const globalData = JSON.parse(localStorage.getItem('usuario_data'))

export const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const day = currentDate.getDate().toString().padStart(2, "0");
export const opciones = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };

export const formattedDate = `${year}-${month}-${day}`;
export const formattedDateWS = `${year}${month}${day}`;
export const formattedDateDD = `${day}-${month}-${year}`;
export const formattedDateDD2 = `${day}/${month}/${year}`;

let horas = currentDate.getHours();
let minutos = currentDate.getMinutes();
let segundos = currentDate.getSeconds();

// Determinar si es AM o PM
const amOpm = horas >= 12 ? 'PM' : 'AM';

// Convertir las horas al formato de 12 horas
horas = horas % 12;
horas = horas ? horas : 12;

export const formattedDateH = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")} ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds()}  ${new Date().getHours() >= 12 ? 'PM' : 'AM'}`;

export const formateaMoneda = (cantidad) =>{
    // Convierte la cadena en un número decimal con 2 decimales
    const numero = parseFloat(cantidad).toFixed(2);
    // Agrega el símbolo de moneda "$" antes del valor
    const formatoMoneda = `$ ${numero}`;
    return formatoMoneda;
}
export const TIME_OUT = 1000 * 60; // 1 minuto

export const hora = currentDate.toLocaleTimeString('es-ES', opciones);
const horaDelDia = new Date().toLocaleTimeString('es-ES', opciones);
horaDelDia.split(":").join("");

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

export const mensajeSinElementos = {
    estilo: 'alert-info',
    icono: 'ri-error-warning-fill'
}

export const mensajeSinOperaciones = {
    estilo: 'alert-warning',
    icono: 'ri-error-warning-fill'
}

// Función para eliminar objetos con cantidad 0
export const eliminarDenominacionesConCantidadCero = (denominacionesObj) => {
    for (const key in denominacionesObj) {
        if (denominacionesObj.hasOwnProperty(key)) {
            if (denominacionesObj[key].hasOwnProperty("cantidad")){
                if (denominacionesObj[key].cantidad === 0 || isNaN(denominacionesObj[key].cantidad)) {
                    delete denominacionesObj[key];
                }
            }
        }
    }
}

export const obtenerObjetoDenominaciones = (denominacionesObj) => {
    const denominacionesArray = [];
    for (const key in denominacionesObj) {
        if (denominacionesObj.hasOwnProperty(key) && key !== 'divisa' && key !== 'tipoOperacion' && key !== 'movimiento') {
            if(denominacionesObj[key].nombre !== undefined && denominacionesObj[key].cantidad !== undefined)
            denominacionesArray.push({ nombre: denominacionesObj[key].nombre, cantidad: parseInt(denominacionesObj[key].cantidad) });
        }
    }
    return {
        divisa: denominacionesObj.divisa,
        tipoOperacion: denominacionesObj.tipoOperacion,
        movimiento: denominacionesObj.movimiento,
        denominacion: denominacionesArray
    };
}

export const obtenerArrayDifDenominaciones = (denominacionesObj) => {
    const denominacionesArray = [];
    for (const key in denominacionesObj) {
        if (denominacionesObj.hasOwnProperty(key)) {
            if(denominacionesObj[key].nombre !== undefined && denominacionesObj[key].cantidad !== undefined)
                denominacionesArray.push({ nombre: denominacionesObj[key].nombre, cantidad: parseInt(denominacionesObj[key].cantidad) });
        }
    }
    return denominacionesArray
}

export const getDenominacion = (divisa = 'MXP', replaceValues) => {

    const denominaciones = [
        'p05','p1','p2','p5', '1', '2', '5', '10', '20', '50', '100', '200', '500', '1000'
    ];

    const getDenominacionCantidad = (nombre) => {
        if (replaceValues && replaceValues.hasOwnProperty(`denominacion_${nombre}`)) {
            const cantidad = replaceValues[`denominacion_${nombre}`];
            return cantidad == '' ? 0 : parseInt(cantidad);
        }
        return 0; // Si no existe la propiedad, asignar 0 por defecto
    };

    const denominacionObj = { divisa };

    for (const nombre of denominaciones) {
        console.log(nombre)
        const valor = nombre.startsWith('p') ? `0.${nombre.substring(1)}` : nombre;
        denominacionObj[`denominacion_${nombre}`] = {
            nombre: valor,
            cantidad: getDenominacionCantidad(nombre)
        };
    }

    console.log(denominacionObj);
    return denominacionObj;
};

export const getDiferenciaDenominacion = (divisa = 'MXP', replaceValues) => {
    const denominaciones = [
        'p05','p1','p2','p5', '1', '2', '5', '10', '20', '50', '100', '200', '500', '1000'
    ];

    const getDenominacionCantidad = (nombre) => {
        if (replaceValues && replaceValues.hasOwnProperty(`diferencia_${nombre}`)) {
            const cantidad = replaceValues[`diferencia_${nombre}`];
            return cantidad === '' ? 0 : parseInt(cantidad);
        }
        return 0; // Si no existe la propiedad, asignar 0 por defecto
    };

    const denominacionObj = { divisa };

    for (const nombre of denominaciones) {
        const valor = nombre.startsWith('p') ? `0.${nombre.substring(1)}` : nombre;
        denominacionObj[`diferencia_${nombre}`] = {
            nombre: valor,
            cantidad: getDenominacionCantidad(nombre)
        };
    }

    return denominacionObj;
};

export const encryptRequest = (data) => {
    const jsonDataString = JSON.stringify(data);
    const key = CryptoJS.enc.Utf8.parse('KtsmylMOoT735gRWHUFj7alBJypXlVNw');
    const iv = CryptoJS.lib.WordArray.random(16);
    const pad = "aqswedrftgyhujio";
    const encryptedData = CryptoJS.AES.encrypt(pad.concat(jsonDataString), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const encryptedBase64 = encryptedData.toString();
    return encryptedBase64
}

export const recordValues = (values) =>{
    if(!values.rememberMe){
        localStorage.setItem("usuario",values.usuario);
        localStorage.setItem("rememberMe",true);
    }else{
        localStorage.removeItem("usuario",values.usuario);
        localStorage.removeItem("rememberMe",false);
    }
}

export const DENOMINACIONES = {
    USD: "DOLARES AMERICANOS",
    EUR: "EUROS",
    GBR: "LIBRAS",
    MXP:'PESOS MEXICANOS'
}

export const DENOMINACIONESM = {
    USD: "dolar",
    EUR: "euro",
    GBR: "libra",
    MXP:'pesos mexicanos'
}

export const FormatoMoneda = (cantidad,moneda) => {
    if (typeof cantidad === 'number') {
        const formatoNumero = cantidad.toLocaleString('es-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return formatoNumero.replace('$', '$ ');
    } else {
        return 'E'; // Opcional: Devuelve una cadena vacía en caso de error.
    }
}

export const redondearNumero =(numero) => {
    const parteEntera = parseInt(numero)
    const parteDec = parseFloat(numero - parteEntera).toPrecision(2);
    let decenas = Math.floor(parteDec * 10)/10;
    let redondeado = Math.round((parteDec * 100) % 10) / 100;
    if(redondeado >= 0.00 && redondeado < 0.05){
        redondeado = 0.00;
    }else if (redondeado >= 0.05 && redondeado <= 0.09){
        redondeado = 0.05;
    }
    return parseFloat(parteEntera + decenas+ redondeado).toFixed(2);
}

export const OPTIONS = {
    position: "top-center",
    theme: "colored",
    closeButton:true,
    autoClose:15000,
    hideProgressBar:true
}

export const getTextDivisa = (divisa) => {
    const divisas = {
        "USD": { plural: "dólares", singular: "dólar" },
        "EUR": { plural: "euros", singular: "euro" },
        "GBR": { plural: "libras", singular: "libra" }
    };

    // Validación de la divisa
    if (divisas.hasOwnProperty(divisa)) {
        return divisas[divisa];
    } else {
        throw new Error("Divisa no reconocida");
    }
}

export const convertirFecha = (input) => {
    // Dividir la cadena de entrada en día, mes y año
    var partes = input.split('/');

    // Crear un objeto Date con los componentes de la fecha
    var fecha = new Date(partes[2], partes[1] - 1, partes[0]);

    // Obtener los componentes de la fecha en formato ISO (yyyy-mm-dd)
    var yyyy = fecha.getFullYear();
    var mm = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var dd = ('0' + fecha.getDate()).slice(-2);

    // Devolver la fecha en formato yyyy-mm-dd
    return yyyy + '-' + mm + '-' + dd;
}

export const obtenDia = (mes) => {
    // Verificar si el mes tiene 30 o 31 días
    if (mes === 4 || mes === 6 || mes === 9 || mes === 11) {
        return 30;
    } else if (mes === 2) {
        // Verificar si el año es bisiesto para febrero
        // Un año bisiesto es divisible por 4, pero no por 100, a menos que sea divisible por 400.
        const esBisiesto = (anio) => (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);

        // Devolver 29 días si es bisiesto, de lo contrario, 28 días
        return esBisiesto(new Date().getFullYear()) ? 29 : 28;
    } else {
        // El resto de los meses tiene 31 días
        return 31;
    }
}

export const obtenerNombreMes = (mes) => {
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Verificar si el número del mes está en el rango válido
    if (mes >= 1 && mes <= 12) {
        // Restar 1 al mes, ya que los arrays en JavaScript son de base 0
        return nombresMeses[mes - 1];
    } else {
        // Devolver un mensaje de error si el número del mes no es válido
        return "Mes no válido";
    }
}

export const formatRelativeTime = (hourString) => {
    const now = new Date();
    const notificationTime = new Date();
    const [hour, minute, second] = hourString.split(':');
    notificationTime.setHours(hour, minute, second);

    const timeDifference = now - notificationTime;
    const seconds = Math.floor(timeDifference / 1000);

    if (seconds < 60) {
        return 'Hace un momento';
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `Hace ${minutes} ${minutes > 1 ? 'minutos' : 'minuto'}`;
    } else {
        const hours = Math.floor(seconds / 3600);
        return `Hace ${hours} ${hours > 1 ? 'horas' : 'hora'}`;
    }
}

export const perfiles = ['Super Usuario','Administrador','Tesorero','Coordinador Logística']