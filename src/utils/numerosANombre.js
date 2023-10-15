export const numeroALetras = (function() {

    const UNIDADES = {
        1: 'un',
        2: 'dos',
        3: 'tres',
        4: 'cuatro',
        5: 'cinco',
        6: 'seis',
        7: 'siete',
        8: 'ocho',
        9: 'nueve',
        0: ''
    }

    const Decenas = (num) => {

        let decena = Math.floor(num / 10);
        let unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0:
                        return 'diez';
                    case 1:
                        return 'once';
                    case 2:
                        return 'doce';
                    case 3:
                        return 'trece';
                    case 4:
                        return 'catorce';
                    case 5:
                        return 'quince';
                    default:
                        return 'dieci' + UNIDADES[unidad];
                }
            case 2:
                switch (unidad) {
                    case 0:
                        return 'veinte';
                    default:
                        return 'veinti' + UNIDADES[unidad];
                }
            case 3:
                return DecenasY('treinta', unidad);
            case 4:
                return DecenasY('cuarenta', unidad);
            case 5:
                return DecenasY('cincuenta', unidad);
            case 6:
                return DecenasY('sesenta', unidad);
            case 7:
                return DecenasY('setenta', unidad);
            case 8:
                return DecenasY('ochenta', unidad);
            case 9:
                return DecenasY('noventa', unidad);
            case 0:
                return UNIDADES[unidad];
        }
    }

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + UNIDADES[numUnidades]

        return strSin;
    } //DecenasY()

    function Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return 'ciento ' + Decenas(decenas);
                return 'cien';
            case 2:
                return 'doscientos ' + Decenas(decenas);
            case 3:
                return 'trescientos ' + Decenas(decenas);
            case 4:
                return 'cuatrocientos ' + Decenas(decenas);
            case 5:
                return 'quinientos ' + Decenas(decenas);
            case 6:
                return 'seiscientos ' + Decenas(decenas);
            case 7:
                return 'setecientos ' + Decenas(decenas);
            case 8:
                return 'ochocientos ' + Decenas(decenas);
            case 9:
                return 'novecientos ' + Decenas(decenas);
        }

        return Decenas(decenas);
    } //Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    } //Seccion()

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor,'mil');
        let strCentenas = Centenas(resto);

        if (strMiles === '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    } //Miles()

    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = Seccion(num, divisor, 'un millon de', 'millones de');
        let strMiles = Miles(resto);

        if (strMillones == '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    } //Millones()

    return function NumeroALetras(num, currency) {
        currency = currency || {};
        let data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural || 'pesos mexicanos', //'PESOS', 'Dólares', 'Bolívares', 'etcs'
            letrasMonedaSingular: currency.singular || 'peso mexicano', //'PESO', 'Dólar', 'Bolivar', 'etc'
            letrasMonedaCentavoPlural: currency.centPlural || 'centavos',
            letrasMonedaCentavoSingular: currency.centSingular || 'centavo'
        };

        if (data.centavos > 0) {
            data.letrasCentavos = 'con ' + (function() {
                if (data.centavos == 1)
                    return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                else
                    return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
            })();
        };

        if (data.enteros === 0)
            return 'cero ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        if (data.enteros == 1)
            return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
        else
            return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    };

})();