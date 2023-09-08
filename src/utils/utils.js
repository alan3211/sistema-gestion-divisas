import CryptoJS from "crypto-js";

const currentDate = new Date();

export const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const day = currentDate.getDate().toString().padStart(2, "0");
const opciones = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };

export const formattedDate = `${year}-${month}-${day}`;
export const formattedDateWS = `${year}${month}${day}`;
export const formattedDateDD = `${day}-${month}-${year}`;

export const formateaMoneda = (cantidad) =>{
    // Convierte la cadena en un número decimal con 2 decimales
    const numero = parseFloat(cantidad).toFixed(2);
    // Agrega el símbolo de moneda "$" antes del valor
    const formatoMoneda = `$ ${numero}`;
    return formatoMoneda;
}
export const TIME_OUT = 1000 * 590;

export const hora = currentDate.toLocaleTimeString('es-ES', opciones);

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
                if (denominacionesObj[key].cantidad === 0) {
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
            denominacionesArray.push({ nombre: denominacionesObj[key].nombre, cantidad: denominacionesObj[key].cantidad });
        }
    }
    return {
        divisa: denominacionesObj.divisa,
        tipoOperacion: denominacionesObj.tipoOperacion,
        movimiento: denominacionesObj.movimiento,
        denominacion: denominacionesArray
    };
}

export const getDenominacion = (divisa = 'MXP', replaceValues) => {
    const denominaciones = [
        'p1', 'p2', 'p5',
        '1', '2', '5', '10', '20', '50', '100', '200', '500', '1000'
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
    console.log("ENCR: ", encryptedBase64);
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