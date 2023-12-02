export const validaFechas = (fecha) => {
    // Verificar el formato de la fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
        return "El formato de fecha es inválido. Utiliza el formato YYYY-MM-DD.";
    }

    // Obtener el año, mes y día de la fecha actual
    const fechaActual = new Date();
    const yearActual = fechaActual.getFullYear();
    const monthActual = fechaActual.getMonth() + 1;
    const dayActual = fechaActual.getDate();

    // Obtener el año, mes y día de la fecha proporcionada
    const [yearNacimiento, monthNacimiento, dayNacimiento] = fecha.split("-").map(Number);

    // Calcular la edad
    let edad = yearActual - yearNacimiento;
    if (monthActual < monthNacimiento || (monthActual === monthNacimiento && dayActual < dayNacimiento)) {
        edad--;
    }

    // Verificar si es mayor de edad
    if (edad < 18) {
        return "El usuario es menor de edad.";
    }

    // Validar año bisiesto
    const esBisiesto = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

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

    return true;
};

export const validarNombreApellido = (name,value) => {
    const nombreRegex = /^$|^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'"]+$/;
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

export const validarAlfaNumerico = (name, value) => {
    const alfanumericoRegex = /^$|^[a-zA-Z\s\d;,.'()//[\]{}!¡"#$%&´*-_+áéíóúÁÉÍÓÚ]+$/;
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
    console.log(correo);
    // Expresión regular más permisiva para validar correos electrónicos
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!correoRegex.test(correo)) {
        return `El correo electrónico ingresado en el campo no es válido.`;
    }
    return true;
};

export const validarNumeroTelefono = (name,value) => {
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(value)) {
        return `El campo ${name} debe contener solo 10 números.`;
    }
    return true;
}
export const validarMoneda = (name, value) => {
    const monedaNumberRegex = /^$|^-?\d+(\.\d{1,5})?$/;
    if (!monedaNumberRegex.test(value)) {
        return `El campo ${name} no corresponde a una moneda válida.`;
    }
    return true;
}

