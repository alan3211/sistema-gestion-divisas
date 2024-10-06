export const validaFechas = (fecha) => {
    // Verificar el formato de la fecha
    /*const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha)) {
        return "El formato de fecha es inválido. Utiliza el formato DD-MM-AAAA.";
    }*/

    if(fecha === ""){
        return 'La fecha ingresada no es valida.';
    }

    // Obtener el año, mes y día de la fecha actual
    const fechaActual = new Date();
    const yearActual = fechaActual.getFullYear();
    const monthActual = fechaActual.getMonth() + 1;
    const dayActual = fechaActual.getDate();

    // Obtener el año, mes y día de la fecha proporcionada
    const [yearNacimiento, monthNacimiento, dayNacimiento] = fecha.split("-").map(Number);

    // Validar año bisiesto de manera más específica
    const esBisiesto = (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));

    // Validar febrero y año bisiesto de manera más específica
    if (monthNacimiento === 2 && dayNacimiento > 28 + (esBisiesto(yearNacimiento) ? 1 : 0)) {
        return `Febrero tiene un máximo de ${28 + (esBisiesto(yearNacimiento) ? 1 : 0)} días para el año proporcionado.`;
    }

    // Validar día, mes y año
    if (yearNacimiento < 1900 || yearNacimiento > yearActual - 18) {
        return `El año de nacimiento debe estar entre 1900 y ${yearActual - 18}.`;
    }

    if (monthNacimiento < 1 || monthNacimiento > 12) {
        return "El mes debe estar entre 1 y 12.";
    }

    const diasEnMes = new Date(yearNacimiento, monthNacimiento, 0).getDate();

    if (dayNacimiento < 1 || dayNacimiento > diasEnMes) {
        return `El día debe estar entre 1 y ${diasEnMes} para el mes y año proporcionados.`;
    }

    // Calcular la edad
    let edad = yearActual - yearNacimiento;
    if (monthActual < monthNacimiento || (monthActual === monthNacimiento && dayActual < dayNacimiento)) {
        edad--;
    }

    // Verificar si es mayor de edad
    if (edad < 18) {
        return "El usuario es menor de edad.";
    }

    return true;
};

export const validaFechaVigencia = (fechaString) => {
    if (fechaString === "") {
        return 'La fecha ingresada no es válida.';
    }

    // Obtener la fecha actual (año, mes y día)
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth() + 1;
    const day = fechaActual.getDate();

    // Construir la fecha actual sin tener en cuenta la zona horaria
    const fechaActualSinHora = new Date(year, month, day);

    // Convertir la fecha de vigencia en formato YYYY-MM-DD a objeto Date
    const fecha = fechaString.split("-");
    const fechaVigencia = new Date(fecha[0],fecha[1],fecha[2]);

    // Verificar si la fecha de vigencia es válida
    if (!isNaN(fechaVigencia.getTime())) {
        const vigenciaYear = fechaVigencia.getFullYear();
        const vigenciaMonth = fechaVigencia.getMonth() + 1;
        const vigenciaDay = fechaVigencia.getDate();

        // Validar el número de días en el mes
        if (vigenciaDay > 0 && vigenciaDay <= new Date(vigenciaYear, vigenciaMonth, 0).getDate()) {
            // Convertir la fecha de vigencia en formato YYYY-MM-DD a objeto Date, sin tener en cuenta la hora
            fechaVigencia.setHours(0, 0, 0, 0);

            if (fechaVigencia >= fechaActualSinHora) {
                return true; // La fecha de vigencia es válida
            } else {
                return 'La fecha de vigencia no es válida.';
            }
        } else {
            return `La fecha de vigencia no es válida. El mes ${vigenciaMonth} tiene menos de ${vigenciaDay} días.`;
        }
    } else {
        return 'La fecha de vigencia no es válida.';
    }
};

export const validarNombreApellido = (name,value) => {
    const nombreRegex = /^$|^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'" ]+$/;
    if (!nombreRegex.test(value)) {
        return `El campo ${name} debe contener solo letras, acentos y la letra 'ñ'.`;
    }
    return true;
}

export const validarNumeros = (name,value) => {
    const numerosRegex = /^\d+$/;
    if (!numerosRegex.test(value)) {
        return `El campo ${name} debe contener solo números del 0 al 9.`;
    }
    return true;
}

export const validarNumerosYVacio = (name,value) => {
    const numerosRegex = /^(\d+|)$/;
    if (!numerosRegex.test(value)) {
        return `El campo ${name} debe contener solo números del 0 al 9.`;
    }
    return true;
}


export const validarAlfaNumerico = (name, value) => {
    const alfanumericoRegex = /^$|^[a-zA-Z\s\d;,.'()//[\]{}!¡"#$%&´*-_+áéíóúÁÉÍÓÚñÑ]+$/;
    if (!alfanumericoRegex.test(value)) {
        return `El campo ${name} debe contener solo caracteres alfanuméricos y los caracteres especiales permitidos.`;
    }
    return true;
};

export const validarMayus = (name, value) => {
    const mayusculasRegex = /^[A-Z]{1,4}$/;
    if (!mayusculasRegex.test(value)) {
        return `El campo ${name} debe contener solo letras mayúsculas y tener un máximo de 4 caracteres.`;
    }
    return true;
};

export const validarCorreoElectronico = (correo) => {
    if(correo === ""){
        return true;
    }

    // Expresión regular más permisiva para validar correos electrónicos
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!correoRegex.test(correo)) {
        return `El correo electrónico ingresado en el campo no es válido.`;
    }
    return true;
};

export const validarNumeroTelefono = (name,value) => {
    const phoneNumberRegex = /^\d{10,10}$/;
    if (!phoneNumberRegex.test(value)) {
        return `El campo ${name} debe contener solo 10 números.`;
    }
    return true;
}
export const validarMoneda = (name, value) => {

    if(value){
        // Verificar que no sea un campo vacío
        if (!value.trim()) {
            return `El campo ${name} no puede estar vacío.`;
        }

        // Verificar el formato numérico con dos decimales
        const monedaNumberRegex = /^$|^-?\d+(\.\d{1,2})?$/;
        if (!monedaNumberRegex.test(value)) {
            return `El campo ${name} no corresponde a una moneda válida (Ejemplo 1.00).`;
        }

        // Verificar que no sea un número negativo
        if (parseFloat(value) < 0) {
            return `No se permiten valores negativos en el campo ${name}.`;
        }

        // Verificar que sea mayor a cero
        if (parseFloat(value) === 0) {
            return `El valor en el campo ${name} debe ser mayor a 0.`;
        }

        return true;
    }else{
        return `El campo ${name} no puede estar vacío.`;
    }
}

export const validarMonedaUSD = (name, value) => {
    if (value){
        // Verificar que no sea un campo vacío
        if (!value.trim()) {
            return `El campo ${name} no puede estar vacío.`;
        }

        // Verificar el formato numérico con dos decimales
        const monedaNumberRegex = /^-?\d+(\.00)?$/;
        if (!monedaNumberRegex.test(value)) {
            return `El campo ${name} no corresponde a una moneda válida (Ejemplo 1.00).`;
        }

        // Verificar que no sea un número negativo
        if (parseFloat(value) < 0) {
            return `No se permiten valores negativos en el campo ${name}.`;
        }

        // Verificar que sea mayor a cero
        if (parseFloat(value) === 0) {
            return `El valor en el campo ${name} debe ser mayor a 0.`;
        }

        return true;
    }else{
        return `El campo ${name} no puede estar vacío.`;
    }
};

export const validarEnteroPositivo = (numero) => {
    if(numero === ""){
        return true;
    }else{
        // Utilizamos la función isNaN para comprobar si no es un número válido
        if (isNaN(numero)) {
            return false;
        }

        // Convertimos el número a entero
        var numeroEntero = parseInt(numero);

        // Comprobamos si es un entero positivo o cero
        if (numeroEntero >= 0 && Number.isInteger(numeroEntero)) {
            return true;
        } else {
            return false;
        }
    }
}
