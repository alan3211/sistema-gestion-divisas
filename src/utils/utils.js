import CryptoJS from "crypto-js";

export const getCurrentDate = () => new Date();

export const getElementosFecha = () => {
    const currentDate = getCurrentDate();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return {day,month,year,hours,minutes,seconds,ampm};
}

export const formattedDate = () => {
    const {day,month,year} = getElementosFecha();
    return `${year}-${month}-${day}`;
}

export const formattedDateWS = () => {
    const {day,month,year} = getElementosFecha();
    return `${year}${month}${day}`;
}

export const formattedDateH = () => {
    const {day,month,year,hours,minutes,seconds,ampm} = getElementosFecha();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
}

export const formattedDateDD = () => {
    const {day,month,year} = getElementosFecha();
    return `${day}-${month}-${year}`;
}

export const formattedDateDD2 = () => {
    const {day,month,year} = getElementosFecha();
    return `${day}/${month}/${year}`;
}

export const formattedDateF = () => {
    const {day,month,year} = getElementosFecha();
    return `${year}-${month}-${day}`;
}




export const globalData = JSON.parse(localStorage.getItem('usuario_data'))

export const opciones = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };


export const TIME_OUT = 1000 * 60; // 1 minuto

export const hora = () => getCurrentDate().toLocaleTimeString('es-ES', opciones).split(":").join("");

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
            return cantidad === '' ? 0 : parseInt(cantidad);
        }
        return 0; // Si no existe la propiedad, asignar 0 por defecto
    };

    const denominacionObj = { divisa };

    for (const nombre of denominaciones) {
        const valor = nombre.startsWith('p') ? `0.${nombre.substring(1)}` : nombre;
        denominacionObj[`denominacion_${nombre}`] = {
            nombre: valor,
            cantidad: getDenominacionCantidad(nombre)
        };
    }
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

export const FormatoDenominacion = (value) => {
    if(['.05','.10','.20','.50',0.05,0.10,0.20,0.50].includes(value)){
        return `${value } ¢`;
    }
    return value;
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

        return formatoNumero.replace('$', '');
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
        "GBR": { plural: "libras", singular: "libra" },
        "MXP": { plural: "pesos mexicanos", singular: "peso mexicano" }
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

export const convertirFechaADD = (input) => {
    // Dividir la cadena de entrada en año, mes y día
    var partes = input.split('-');

    // Crear un objeto Date con los componentes de la fecha
    var fecha = new Date(partes[0], partes[1] - 1, partes[2]);

    // Obtener los componentes de la fecha en formato DD/MM/YYYY
    var dd = ('0' + fecha.getDate()).slice(-2);
    var mm = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var yyyy = fecha.getFullYear();

    // Devolver la fecha en formato DD/MM/YYYY
    return dd + '/' + mm + '/' + yyyy;
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

const esBisiesto = (anio) => (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);

export const obtenerDiasEnMes = (mes, anio)=> {
    // Array con la cantidad de días por mes (sin contar el año bisiesto)
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Si el mes es febrero y el año es bisiesto, se actualiza la cantidad de días
    if (parseInt(mes) === 2 && esBisiesto(anio)) {
        return 29;
    }
    return diasPorMes[parseInt(mes)-1];
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

export const obtenerFechaDiaAnterior = () => {
    // Obtén la fecha actual
    const fechaActual = new Date();

    // Resta un día a la fecha actual
    fechaActual.setDate(fechaActual.getDate() - 1);

    // Formatea la fecha en YYYY-MM-DD
    const anio = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
}

export const perfiles = ['Super Usuario','Administrador','Tesorero','Coordinador Logística']