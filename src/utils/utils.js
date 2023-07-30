const currentDate = new Date();

export const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const day = currentDate.getDate().toString().padStart(2, "0");
const opciones = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };

export const formattedDate = `${year}-${month}-${day}`;
export const formattedDateWS = `${year}${month}${day}`;
export const formattedDateDD = `${day}-${month}-${year}`;

export const hora = currentDate.toLocaleTimeString('es-ES', opciones);


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

export const getDenominacion = (divisa='MXP') =>{
    if (divisa === 'MXP') {
        return {
            divisa,
            denominacion_p1:{nombre:"0.10", cantidad:0},
            denominacion_p2:{nombre:"0.20", cantidad:0},
            denominacion_p5:{nombre:"0.50", cantidad:0},
            denominacion_1:{nombre:"1", cantidad:0},
            denominacion_2:{nombre:"2", cantidad:0},
            denominacion_5:{nombre:"5", cantidad:0},
            denominacion_10:{nombre:"10", cantidad:0},
            denominacion_20:{nombre:"20", cantidad:0},
            denominacion_50:{nombre:"50", cantidad:0},
            denominacion_100:{nombre:"100", cantidad:0},
            denominacion_200:{nombre:"200", cantidad:0},
            denominacion_500:{nombre:"500", cantidad:0},
            denominacion_1000:{nombre:"1000", cantidad:0},
            moneda: divisa,
        }
    } else {
        return {
            divisa,
            denominacion_1:{nombre:"1", cantidad:0},
            denominacion_2:{nombre:"2", cantidad:0},
            denominacion_5:{nombre:"5", cantidad:0},
            denominacion_10:{nombre:"10", cantidad:0},
            denominacion_20:{nombre:"20", cantidad:0},
            denominacion_50:{nombre:"50", cantidad:0},
            denominacion_100:{nombre:"100", cantidad:0},
            moneda: divisa,
        }
    }
}