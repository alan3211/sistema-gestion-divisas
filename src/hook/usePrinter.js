import {connetor_plugin} from "../js/plugin_impresora_termica";
import {
    DENOMINACIONESM,
    encryptRequest,
    formattedDateDD2,
    getTextDivisa,
    opciones
} from "../utils";

import {obtieneDisposicionLPB, obtieneTicket} from "../services/tools-services";
import {numeroALetras} from "../utils/numerosANombre";

export const usePrinter = (datos) => {

    let dataTicket={};
    let nombreImpresora = "EPSON TM-T88VI Receipt";
    let api_key = "a3c8f13a-8722-4387-f0bf-0ac2e9dd74f7"

    const getEstructuraTicket = async (tipo) => {
        try {
            const valores = {
                usuario: datos["No Usuario"],
                ticket: datos["No Ticket"]
            }
            const encryptedData = encryptRequest(valores);
            const response = await obtieneTicket(encryptedData);
            dataTicket = response.result_set[0];

            const conector = new connetor_plugin()
            if (tipo === 0) {
                ticket(0, conector)
                ticket(1, conector)
            } else if (tipo === 2) {
                ticket(2, conector)
            }else{
                ticketCajaSucursal(3,conector)
                ticketCajaSucursal(4,conector)
            }
            const resp = await conector.imprimir(nombreImpresora, api_key);
            if (resp === true) {
                mostrar_impresoras();
                if(tipo === 0){
                    abreCajon();
                }
            } else {
                console.log("Problema al imprimir: " + resp)
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Genera estructura de ticket LPB
    const getEstructuraTicketLPB = async () => {
        try {

            const valores = {
                usuario: datos["No Usuario"],
                ticket: datos["No Ticket"]
            }
            const encryptedData = encryptRequest(valores);
            const response = await obtieneDisposicionLPB(encryptedData);
            dataTicket = response.result_set[0].Disposicion;
            const conector = new connetor_plugin()
            ticketLPB(0, conector,dataTicket)
            ticketLPB(1, conector,dataTicket)
            const resp = await conector.imprimir(nombreImpresora, api_key);
            if (resp === true) {
                mostrar_impresoras();
            } else {
                console.log("Problema al imprimir: " + resp)
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Busca todas las impresoras que estan conectadas al equipo
    const mostrar_impresoras = () => {
        connetor_plugin.obtenerImpresoras()
            .then(impresoras => {
                console.log(impresoras)
            });
    }

    const ticket = (opcion, conector) => {

        const currency = {
            plural:"pesos mexicanos",
            singular: "peso mexicano",
            centPlural: "centavos",
            centSingular: "centavo"
        }
        if(dataTicket["Operación"] !== 'COMPRA'){
            currency.plural = getTextDivisa(dataTicket.Divisa).plural;
            currency.singular = getTextDivisa(dataTicket.Divisa).singular;
        }
        const valor = numeroALetras(parseFloat(dataTicket["Monto Entregado"]), currency);

        conector.fontsize("1")
        conector.textaling("center")
        conector.text(`${opcion === 0 ? '-- ORIGINAL --' : opcion === 1 ? '-- COPIA USUARIO --' : ' -- REIMPRESION --'}`)
        conector.img_url("https://grocerys-front.wittysmoke-209c31ac.eastus.azurecontainerapps.io/static/media/logo.024785155dae25af5d6a.png")
        conector.fontsize("1")
        conector.text(`Reg. CNBV: ${dataTicket.Registro}`)
        conector.text(dataTicket.Nombre)
        conector.text(dataTicket.Domicilio)
        conector.text(`Sucursal: ${dataTicket.Sucursal}`)
        conector.textaling("left")
        conector.text("------------------------------------------")
        conector.text(`Fecha: ${formattedDateDD2()}    Folio: ${dataTicket.Folio}`)
        conector.text(`${new Date().toLocaleTimeString('es-ES', opciones)} horas          # Usuario: ${dataTicket.Usuario}`)
        conector.text("------------------------------------------")
        conector.text(dataTicket["Operación"])
        conector.text(`Divisa: ${DENOMINACIONESM[dataTicket.Divisa]}           $ ${dataTicket["Operación"] === 'COMPRA' ? dataTicket.Monto :dataTicket["Monto Entregado"]} ${dataTicket.Divisa} `)
        conector.text("------------------------------------------")
        conector.text(`Tipo de Cambio:         $ ${dataTicket["Tipo Cambio"]} MXN `)
        conector.text("------------------------------------------")
        conector.feed("1")
        conector.text(`Cantidad recibida:      $ ${dataTicket["Total Recibido"]} ${dataTicket["Operación"] === 'COMPRA' ? dataTicket.Divisa:'MXN'}`)
        conector.text(`Su cambio:              $ ${dataTicket.Cambio} ${dataTicket["Operación"] !== 'COMPRA' ?'MXN': dataTicket.Divisa}`)
        conector.feed("1")
        conector.text("------------------------------------------")
        conector.feed("1")
        conector.text(`Total:                  $ ${dataTicket["Monto Entregado"]} ${dataTicket["Operación"] !== 'COMPRA' ? dataTicket.Divisa:'MXN'}`)
        conector.text(`(${valor} 00/100)`)
        conector.feed("2")
        conector.text("------------------------------------------")
        conector.text(`Atendido por: ${dataTicket.Atendido}`)
        conector.text("------------------------------------------")
        conector.text(`${dataTicket["Nombre Cliente"]}${dataTicket.Protesta}`)
        conector.feed("2")
        conector.textaling("center")
        conector.text(`______________________`)
        conector.text(` Firma de conformidad `)
        conector.feed("1")
        conector.textaling("left")
        conector.text("------------------------------------------")
        conector.text(`${dataTicket.Factura}`)
        conector.text("------------------------------------------")
        conector.text(`${dataTicket.Nombre}, ubicado en ${dataTicket.Domicilio}. ${dataTicket.Obligacion}`)
        conector.feed("5")
        conector.cut("0")
    }

    //Estructura para el ticket LPB
    const ticketLPB = (opcion, conector,disposicionLPB) => {

        conector.fontsize("1")
        conector.textaling("center")
        conector.text(`${opcion === 0 ? '-- ORIGINAL --' : '-- COPIA USUARIO --'}`)
        conector.img_url("https://grocerys-front.wittysmoke-209c31ac.eastus.azurecontainerapps.io/static/media/logo.024785155dae25af5d6a.png")
        conector.fontsize("1")
        conector.textaling("left")
        conector.text("------------------------------------------")
        conector.text(`Fecha: ${formattedDateDD2()}    AVISO LPB`)
        conector.text(`${new Date().toLocaleTimeString('es-ES', opciones)} horas`)
        conector.text("------------------------------------------")
        conector.text(disposicionLPB)
        conector.text("------------------------------------------")
        conector.feed("2")
        conector.textaling("center")
        conector.text(`______________________`)
        conector.text(` Firma de conformidad `)
        conector.feed("5")
        conector.cut("0")
    }

    //Ticket para Cajero y Administrador Sucursal
    const ticketCajaSucursal = (opcion, conector) => {
        const currency = {
            plural:"pesos mexicanos",
            singular: "peso mexicano",
            centPlural: "centavos",
            centSingular: "centavo"
        }

        if(dataTicket["Operación"] !== 'COMPRA'){
            currency.plural = getTextDivisa(datos.Moneda).plural;
            currency.singular = getTextDivisa(datos.Moneda).singular;
        }
        const valor = numeroALetras(parseFloat(dataTicket["Monto Entregado"]), currency);

        conector.fontsize("1")
        conector.textaling("center")
        conector.text(`${opcion === 3 ? '-- CAJERO --' : ' -- OFICINA ADMINISTRATIVA --'}`)
        conector.img_url("https://grocerys-front.wittysmoke-209c31ac.eastus.azurecontainerapps.io/static/media/logo.024785155dae25af5d6a.png")
        conector.fontsize("1")
        conector.text(dataTicket.Registro)
        conector.text(dataTicket.Nombre)
        conector.text(dataTicket.Domicilio)
        conector.text(`Sucursal: ${dataTicket.Sucursal}`)
        conector.textaling("left")
        conector.text("------------------------------------------")
        conector.text(`Fecha: ${formattedDateDD2()}    Folio: ${dataTicket.Folio}`)
        conector.text(`${new Date().toLocaleTimeString('es-ES', opciones)} horas          # Usuario: ${dataTicket.Usuario}`)
        conector.text("------------------------------------------")
        conector.text(dataTicket["Operación"])
        conector.text(`Divisa: ${DENOMINACIONESM[datos.Moneda]}           $ ${dataTicket["Operación"] === 'COMPRA' ? dataTicket["Total Recibido"] :dataTicket["Monto Entregado"]} ${dataTicket.Divisa} `)
        conector.text("------------------------------------------")
        conector.feed("1")
        conector.text(`Cantidad recibida:      $ ${dataTicket["Total Recibido"]} ${dataTicket["Operación"] === 'COMPRA' ? dataTicket.Divisa:'MXN'}`)
        conector.text(`Cantidad entregada:     $ ${dataTicket.Cambio} ${dataTicket["Operación"] !== 'COMPRA' ?'MXN': dataTicket.Divisa}`)
        conector.feed("1")
        conector.text("------------------------------------------")
        conector.feed("1")
        conector.text(`Total:                  $ ${dataTicket["Monto Entregado"]} ${dataTicket["Operación"] !== 'COMPRA' ? dataTicket.Divisa:'MXN'}`)
        conector.text(`(${valor} 00/100)`)
        conector.feed("2")
        conector.text("------------------------------------------")
        conector.text(`Atendido por: ${dataTicket.Atendido}`)
        conector.text("------------------------------------------")
        conector.feed("2")
        conector.textaling("center")
        conector.text(`______________________`)
        conector.text(` Firma de conformidad `)
        conector.text("------------------------------------------")
        conector.feed("5")
        conector.cut("0")
    }

    const imprimeTicketNuevamente = (tipo) => imprimirDoc(tipo);

    const imprimirDoc = async (tipo) => {
        if(datos['No Usuario'] !== ''){
            const response = await getEstructuraTicket(tipo);
        }
    }

    const abreCajon = async () =>{
        let nombreImpresora = "EPSON TM-T88VI Receipt";
        let puerto = 4568;
        const respuesta = await fetch(`http://localhost:${puerto}/?impresora=${nombreImpresora}`);
        const respuestaDecodificada = await respuesta.json();
        if (respuesta.status === 200) {
            console.log("Cajón abierto");
        } else {
            console.error("Error abriendo: " + respuestaDecodificada);
        }
    }

    const imprimeTicketLPB = async () => {
        const response = await getEstructuraTicketLPB();
    }

    return {
        imprimir:imprimirDoc,
        mostrar_impresoras,
        imprimeTicketNuevamente,
        imprimeTicketLPB,
        abreCajon,
    }
}
